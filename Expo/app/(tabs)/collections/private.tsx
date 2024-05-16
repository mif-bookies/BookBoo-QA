import CollectionLink from "@/components/CollectionLink";
import CollectionLinkSkeleton from "@/components/CollectionLinkSkeleton";
import CreateCollectionSheet from "@/components/CreateCollectionSheet";
import EmptyResults from "@/components/EmptyResults";
import { Collection } from "@/entities/collection";
import { api } from "@/libs/axios/api";
import { useSetupAuthenticatedApi } from "@/libs/axios/authenticatedapi";
import { useUser } from "@clerk/clerk-expo";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons/faBookBookmark";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useRef } from "react";
import { Pressable, View } from "react-native";

const Page = () => {
  useSetupAuthenticatedApi();
  const navigation = useNavigation();
  const { user } = useUser();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="rounded-full overflow-hidden">
          <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <FontAwesomeIcon size={28} color="#78716c" icon={faPlus} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const fetchCollections = async (userId: string) => {
    const response = await api.get(`api/users/${userId}/collections`);
    return response.data;
  };

  const { data, isSuccess, isLoading } = useQuery<Collection[], AxiosError>({
    queryKey: ["myCollections", String(user?.id)],
    queryFn: () => fetchCollections(String(user?.id)),
    enabled: !!user?.id,
  });

  return (
    <View className="flex max-w-full h-screen py-8 px-5 gap-2">
      {isLoading ? (
        <View className="flex-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <CollectionLinkSkeleton key={index} />
          ))}
        </View>
      ) : isSuccess ? (
        <View className="flex-1 gap-4">
          {data?.map((collection) => (
            <CollectionLink
              icon={faBookBookmark}
              iconColor="#6b7280"
              label={collection.name}
              path={`/collections/${collection.id}`}
              key={collection.id}
            />
          ))}
        </View>
      ) : (
        <EmptyResults title={"No collections found!"} />
      )}
      {user?.id && (
        <CreateCollectionSheet ref={bottomSheetRef} userId={user.id} />
      )}
    </View>
  );
};

export default Page;
