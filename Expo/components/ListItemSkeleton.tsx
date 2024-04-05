import React from "react";
import { View } from "react-native";

const ListItemSkeleton = () => {
  return (
    <View className="flex gap-2">
      <View className="flex flex-row gap-2">
        <View
          style={{
            width: 100,
            height: 100,
          }}
          className="justify-center self-center bg-neutral-200 rounded-lg"
        />
        <View className="flex-1 gap-2 min-w-0">
          <View className="h-5 w-full bg-neutral-200 my-1 rounded" />
          <View className="h-5 w-1/2 bg-neutral-200 my-1 rounded" />
          <View className="flex-row flex-wrap gap-3 my-1">
            {[...Array(3)].map((_, i) => (
              <View
                key={`placeholder-icon-${i}`}
                className="h-10 w-10 bg-neutral-200 rounded-full"
              />
            ))}
          </View>
        </View>
      </View>
      <View className="flex-1 h-0.5 bg-gray-300 my-2" />
    </View>
  );
};

export default ListItemSkeleton;
