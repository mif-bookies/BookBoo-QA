import React from "react";
import { View } from "react-native";
import StarRatingDisplay from "./StarRatingDisplay";

const BookDetailsSKeleton = () => {
  return (
    <>
      <View
        style={{
          width: "50%",
          height: 300,
        }}
        className="justify-center self-center bg-neutral-200 rounded-lg"
      />
      <View className="h-[30px] w-[70%] bg-neutral-200 self-center my-2 rounded" />
      <View className="h-5 w-1/2 bg-neutral-200 self-center mt-2 mb-1 rounded" />
      <View className="flex flex-row gap-2 justify-center mt-2 mb-1 items-center">
        <StarRatingDisplay rating={0} starSize={30} color="#c2c2c2" />
        <View className="h-6 w-[10%] bg-neutral-200 rounded" />
      </View>
      <View className="h-5 w-[30%] bg-neutral-200 self-center mt-2 mb-1 rounded" />
      <View className="flex flex-col w-full self-center my-1">
        {[...Array(5)].map((_, i) => (
          <View
            key={`placeholder-line-${i}`}
            className="h-4 w-full bg-neutral-200 my-1 rounded"
          />
        ))}
      </View>
      <View className="flex flex-col mt-2">
        <View className="flex-row flex-wrap gap-3 my-1">
          {[...Array(3)].map((_, i) => (
            <View
              key={`placeholder-icon-${i}`}
              className="h-10 w-10 bg-neutral-200 rounded-full"
            />
          ))}
        </View>

        <View className="h-5 w-1/4 bg-neutral-200 my-1 rounded" />
        <View className="h-5 w-2/5 bg-neutral-200 my-1 rounded" />
      </View>
    </>
  );
};

export default BookDetailsSKeleton;
