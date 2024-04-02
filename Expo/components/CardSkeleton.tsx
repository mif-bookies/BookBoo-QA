import React from "react";
import { View, Text } from "react-native";
import MascotImage from "./MascotImage";

const CardSkeleton = () => {
  return (
    <View
      className="flex mx-6 shadow-lg rounded-xl bg-white justify-center items-center overflow-hidden min-h-[35rem] max-h-[35rem] min-w-[90%] max-w-[90%]"
      style={{ aspectRatio: 1, marginTop: 45 }}
    >
      <MascotImage width={250} height={250} />
      <Text className="text-2xl font-semibold">Discovery Deck</Text>
    </View>
  );
};

export default CardSkeleton;
