import React from "react";
import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

const CollectionLinkSkeleton = () => (
  <View className="gap-5">
    <View className="flex flex-row justify-between items-center w-full">
      <View className="flex-row gap-3 items-center">
        <View className="w-7 h-7 bg-gray-300 rounded-full" />
        <View className="w-24 h-5 bg-gray-300 rounded" />
      </View>
      <FontAwesomeIcon icon={faChevronRight} />
    </View>
    <View className="flex flex-row w-full">
      <View className="flex-1 h-0.5 bg-gray-300" />
    </View>
  </View>
);

export default CollectionLinkSkeleton;
