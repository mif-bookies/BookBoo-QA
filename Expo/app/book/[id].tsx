import BookDetails from "@/components/BookDetails";
import BookDetailsSkeleton from "@/components/BookDetailsSkeleton";
import DropdownComponent from "@/components/Dropdown";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import { Book } from "@/entities/book";
import { api } from "@/libs/axios/api";
import { useSetupAuthenticatedApi } from "@/libs/axios/authenticatedapi";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface Collection {
  id: number;
  name: string;
  public: boolean;
  books: Book[];
}

const Page = () => {
  useSetupAuthenticatedApi();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookId = Array.isArray(id) ? id[0] : id;

  const { user } = useUser();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [method, setMethod] = useState("Content-Based");
  const [count, setCount] = useState("5");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>(bookId);

  useEffect(() => {
    if (method === "Content-Based") {
      setCount("5");
    }
  }, [method]);

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
  };

  const handleCountChange = (newCount: string) => {
    setCount(newCount);
  };

  const {
    data: book,
    isLoading: detailsLoading,
    error: detailsError,
  } = useBookDetails(bookId);
  const {
    data: recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
  } = useBookRecommendations(bookId, method, count);

  const {
    data: userCollections,
    isSuccess: collectionsSuccess,
    error: collectionsError,
  } = useQuery({
    queryKey: ["userCollections", user?.id],
    queryFn: () => fetchUserCollectionsWithBooks(String(user?.id)),
    enabled: !!user?.id,
  });

  const queryClient = useQueryClient();

  const addToCollectionMutation = useMutation({
    mutationFn: (collectionId: number) =>
      api.post(`/api/collection/${collectionId}/book`, {
        book_id: parseInt(selectedBookId, 10),
      }),
    onMutate: async (collectionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["userCollections", user?.id],
      });

      const previousCollections = queryClient.getQueryData<Collection[]>([
        "userCollections",
        user?.id,
      ]);

      const newCollections = previousCollections?.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              books: [
                ...collection.books,
                { id: parseInt(selectedBookId, 10) },
              ],
            }
          : collection
      );

      queryClient.setQueryData(["userCollections", user?.id], newCollections);

      return { previousCollections };
    },
    onError: (error, _, context: any) => {
      console.error("Add to collection failed", error);
      queryClient.setQueryData(
        ["userCollections", user?.id],
        context.previousCollections
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", user?.id],
      });
    },
  });

  const removeFromCollectionMutation = useMutation({
    mutationFn: (collectionId: number) =>
      api.delete(`/api/collection/${collectionId}/book/${selectedBookId}`),
    onMutate: async (collectionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["userCollections", user?.id],
      });

      const previousCollections = queryClient.getQueryData<Collection[]>([
        "userCollections",
        user?.id,
      ]);

      const newCollections = previousCollections?.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              books: collection.books.filter(
                (book) => book.id !== parseInt(selectedBookId, 10)
              ),
            }
          : collection
      );

      queryClient.setQueryData(["userCollections", user?.id], newCollections);

      return { previousCollections };
    },
    onError: (error, _, context: any) => {
      console.error("Remove from collection failed", error);
      queryClient.setQueryData(
        ["userCollections", user?.id],
        context.previousCollections
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", user?.id],
      });
    },
  });

  const handleCollectionPress = (
    collectionId: number,
    inCollection: boolean
  ) => {
    if (inCollection) {
      removeFromCollectionMutation.mutate(collectionId);
    } else {
      addToCollectionMutation.mutate(collectionId);
    }
  };

  useEffect(() => {
    if (collectionsSuccess && userCollections) {
      setCollections(userCollections);
    }
    if (collectionsError) {
      console.error("Error fetching collections:", collectionsError);
    }
  }, [collectionsSuccess, userCollections, collectionsError]);

  useEffect(() => {
    if (user) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            onPress={() => bottomSheetRef.current?.expand()}
            style={{ marginRight: 16 }}
          >
            <FontAwesome name="save" size={24} color="black" />
          </Pressable>
        ),
      });
    }
  }, [user, navigation]);

  if (detailsLoading) {
    return <BookDetailsSkeleton />;
  }

  if (detailsError) {
    return <Text>Error: {detailsError.message}</Text>;
  }

  if (!book) {
    return <Text>Book not found</Text>;
  }

  return (
    <>
      <ScrollView
        className="flex flex-col px-5"
        contentContainerClassName="py-8"
      >
        <BookDetails {...book} />
        <View className="flex flex-col gap-2 my-3">
          <View className="flex-1 h-0.5 bg-gray-300 my-2" />
          <Text className="self-center font-semibold text-xl">
            Similar Book Recommendations
          </Text>
          <DropdownComponent
            schema={methodSchema}
            onValueChange={handleMethodChange}
          />
          {method !== "Content-Based" && (
            <DropdownComponent
              schema={countSchema}
              onValueChange={handleCountChange}
            />
          )}
          <View className="flex-1 h-0.5 bg-gray-300 my-2" />
        </View>
        {recommendationsLoading ? (
          Array.from({ length: Number(count) }).map((_, index) => (
            <ListItemSkeleton key={`skeleton-${index}`} />
          ))
        ) : recommendationsError ? (
          <Text>Error: {recommendationsError.message}</Text>
        ) : (
          recommendations?.map((book) => <ListItem {...book} key={book.id} />)
        )}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose
      >
        <View className="p-4">
          <Text className="font-medium text-xl">Your Collections</Text>
          {collections.map((collection) => {
            const books = collection.books ?? [];
            const inCollection = books.some(
              (b) => b.id === Number(selectedBookId)
            );
            return (
              <Pressable
                key={collection.id}
                onPress={() =>
                  handleCollectionPress(collection.id, inCollection)
                }
                className="flex flex-row items-center justify-between py-2"
              >
                <Text className="text-lg">{collection.name}</Text>
                <FontAwesome
                  name={inCollection ? "bookmark" : "bookmark-o"}
                  size={24}
                  color="black"
                />
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
};

export default Page;

const methodSchema = [
  {
    label: "Content-Based",
    description: "Content-Based",
  },
  {
    label: "Collaborative",
    description: "Collaborative",
  },
  {
    label: "Hybrid",
    description: "Hybrid",
  },
];

const countSchema = [
  {
    label: "Book Count: 5",
    description: "5",
  },
  {
    label: "Book Count: 10",
    description: "10",
  },
  {
    label: "Book Count: 15",
    description: "15",
  },
];

const useBookDetails = (bookId: string) => {
  const { data, isLoading, error } = useQuery<Book>({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookDetails(bookId),
    enabled: !!bookId,
  });
  return { data, isLoading, error };
};

const fetchBookDetails = async (bookId: string) => {
  const { data } = await api.get(`/api/book/${bookId}`);
  return data;
};

const useBookRecommendations = (
  bookId: string,
  method: string,
  count: string
) => {
  const { data, isLoading, error } = useQuery<Book[]>({
    queryKey: ["recommendations", bookId, method, count],
    queryFn: () => fetchBookRecommendations(bookId, method, count),
    enabled: !!bookId && !!method && !!count,
  });

  return { data, isLoading, error };
};

const fetchBookRecommendations = async (
  bookId: string,
  method: string,
  count: string
) => {
  const { data } = await api.get(
    `/api/recommend?book_id=${bookId}&method=${method}&limit=${count}`
  );
  return data;
};

const fetchUserCollections = async (userId: string) => {
  const { data } = await api.get(`/api/users/${userId}/collections`);
  return data;
};

const fetchUserCollectionsWithBooks = async (userId: string) => {
  const collections = await fetchUserCollections(userId);
  const collectionsWithBooks = await Promise.all(
    collections.map(async (collection: Collection) => {
      const { data: books } = await api.get(`/api/collection/${collection.id}`);
      return { ...collection, books: books.books };
    })
  );
  return collectionsWithBooks;
};
