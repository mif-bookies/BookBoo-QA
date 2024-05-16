import CollectionLink from "@/components/CollectionLink";
import CollectionLinkSkeleton from "@/components/CollectionLinkSkeleton";
import EmptyResults from "@/components/EmptyResults";
import { Collection } from "@/entities/collection";
import { api } from "@/libs/axios/api";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons/faBookBookmark";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { View } from "react-native";

const Page = () => {
  const fetchPublicCollections = async () => {
    const response = await api.get("api/collection");
    return response.data;
  };

  const { data, isSuccess, isLoading } = useQuery<Collection[], AxiosError>({
    queryKey: ["publicCollections"],
    queryFn: fetchPublicCollections,
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
    </View>
  );
};

export default Page;
