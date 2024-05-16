import { View, Text } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

const EmptyResults = ({ title }: { title: string }) => {
  return (
    <View className="flex flex-col h-full px-5 py-3 justify-center">
      <View className="flex gap-4 self-center items-center">
        <FontAwesomeIcon icon={faMagnifyingGlass} size={128} color="#6b7280" />
        <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      </View>
    </View>
  );
};

export default EmptyResults;
