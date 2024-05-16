import EditCollectionSheet from "@/components/EditCollectionSheet";
import EmptyResults from "@/components/EmptyResults";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import { Book } from "@/entities/book";
import { Collection } from "@/entities/collection";
import { api } from "@/libs/axios/api";
import { useSetupAuthenticatedApi } from "@/libs/axios/authenticatedapi";
import { useUser } from "@clerk/clerk-expo";
import {
  faLock,
  faPenToSquare,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Modal, Pressable, Text, View, Button } from "react-native";

interface BooksAndOwnership {
  title: string;
  books: Book[];
  isOwner: boolean;
  public: boolean;
}

const CollectionDetailsPage = () => {
  useSetupAuthenticatedApi();
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const navigation = useNavigation();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);
  const [showRemoveBookModal, setShowRemoveBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const queryClient = useQueryClient();

  const fetchCollectionDetails = async (): Promise<BooksAndOwnership> => {
    const response = await api.get(`/api/collection/${collectionId}`);
    return response.data;
  };

  const { data, isSuccess, isLoading } = useQuery<BooksAndOwnership, Error>({
    queryKey: ["collectionDetails", collectionId],
    queryFn: fetchCollectionDetails,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setName(data.title);
      setIsPublic(data.public);
      if (data.isOwner) {
        navigation.setOptions({
          headerRight: () => (
            <View className="rounded-full">
              <Pressable
                android_ripple={{ color: "rgba(0,0,0,0.1)" }}
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <FontAwesomeIcon
                  size={28}
                  color="#78716c"
                  icon={faPenToSquare}
                />
              </Pressable>
            </View>
          ),
        });
      } else {
        navigation.setOptions({
          headerRight: () => null,
        });
      }
    }
  }, [isSuccess, data, navigation]);

  const editMutation = useMutation({
    mutationFn: (updatedCollection: Partial<Collection>) =>
      api.patch(`/api/collection/${collectionId}`, updatedCollection),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionDetails", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myCollections", String(user?.id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["publicCollections"],
      });
      bottomSheetRef.current?.close();
      Keyboard.dismiss();
    },
    onError: (error) => {
      console.error("Update failed", error);
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: () => api.delete(`/api/collection/${collectionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myCollections", String(user?.id)],
      });
      data?.public &&
        queryClient.invalidateQueries({
          queryKey: ["publicCollections"],
        });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Delete failed", error);
    },
  });

  const removeBookMutation = useMutation({
    mutationFn: (bookId: string) =>
      api.delete(`/api/collection/${collectionId}/book/${bookId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionDetails", collectionId],
      });
    },
    onError: (error) => {
      console.error("Remove book failed", error);
    },
  });

  const handleEdit = () => {
    console.log("Saving changes:", { name, public: isPublic });
    editMutation.mutate({ name, public: isPublic });
  };

  const handleDeleteCollection = () => {
    deleteCollectionMutation.mutate();
  };

  const handleRemoveBook = () => {
    if (selectedBook) {
      removeBookMutation.mutate(String(selectedBook.id));
      setShowRemoveBookModal(false);
    }
  };

  return (
    <View className="flex-1 px-5">
      {isLoading && (
        <>
          {[...Array(3)].map((_, index) => (
            <ListItemSkeleton key={index} />
          ))}
        </>
      )}
      {isSuccess && (
        <>
          <View className="flex flex-row self-center items-center gap-3 pt-5">
            <FontAwesomeIcon
              icon={data.public ? faUnlock : faLock}
              size={24}
              color="#d97706"
            />
            <Text className="flex-row text-2xl font-bold">{data.title}</Text>
          </View>
          <View className="h-0.5 bg-gray-300 my-2" />
          {data.books.length !== 0 ? (
            data.books.map((book) => (
              <ListItem
                key={book.id}
                id={book.id}
                title={book.title}
                coverImage={book.coverImage}
                authors={book.authors}
                genres={book.genres}
                onLongPress={(id, title) => {
                  setSelectedBook({ id, title });
                  setShowRemoveBookModal(true);
                }}
              />
            ))
          ) : (
            <EmptyResults title="No Books in Collection!" />
          )}
        </>
      )}

      <EditCollectionSheet
        ref={bottomSheetRef}
        name={name}
        setName={setName}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        handleEdit={handleEdit}
        handleDelete={() => setShowDeleteCollectionModal(true)}
      />

      <Modal
        visible={showRemoveBookModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-md p-5 w-4/5">
            <Text className="text-lg font-bold">Confirm Remove</Text>
            <Text className="mt-2">
              Are you sure you want to remove {selectedBook?.title} from this
              collection?
            </Text>
            <View className="flex-row justify-end mt-4 gap-4">
              <Button
                title="Cancel"
                onPress={() => setShowRemoveBookModal(false)}
              />
              <Button title="Remove" color="red" onPress={handleRemoveBook} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteCollectionModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-md p-5 w-4/5">
            <Text className="text-lg font-bold">Confirm Delete</Text>
            <Text className="mt-2">
              Are you sure you want to delete this collection?
            </Text>
            <View className="flex-row justify-end mt-4 gap-4">
              <Button
                title="Cancel"
                onPress={() => setShowDeleteCollectionModal(false)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => {
                  handleDeleteCollection();
                  setShowDeleteCollectionModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CollectionDetailsPage;
