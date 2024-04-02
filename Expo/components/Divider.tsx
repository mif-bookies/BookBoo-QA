import { View, Text } from "react-native";
import React from "react";

const Divider = () => {
  return (
    <View className="flex flex-row items-center justify-center">
      <View className="flex-1 h-0.5 bg-gray-300" />
      <Text className="px-2 text-sm text-gray-600">or</Text>
      <View className="flex-1 h-0.5 bg-gray-300" />
    </View>
  );
};

export default Divider;
