import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

interface Props {
  title: string;
  coverImage: string;
  averageRating: number;
  publicationYear: number;
  pageCount?: number;
}

const CardFront = ({
  title,
  coverImage,
  averageRating,
  publicationYear,
  pageCount,
}: Props) => {
  return (
    <View className="flex my-5 shadow-lg rounded-xl bg-white min-h-[35rem] max-h-[35rem] overflow-hidden">
      <ImageBackground
        source={{ uri: coverImage }}
        blurRadius={10}
        className="rounded-2xl min-h-[26.25rem] flex-1"
      >
        <Image
          source={{ uri: coverImage }}
          style={{
            resizeMode: "contain",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          className="rounded-2xl min-h-[26.25rem] max-h-[26.25rem]"
        />
        <View className="absolute left-0 right-0 bottom-0 h-1/4 bg-white align-center py-3 px-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-semibold" numberOfLines={1}>
                {title}
              </Text>
            </View>
            <Text className="font-bold text-xl">
              <Text className="color-blue-500">{averageRating * 2}</Text>/10
            </Text>
          </View>
          <View className="flex flex-row justify-between items-center mt-5">
            <View className="flex gap-1">
              <Text className="font-semibold text-xl text-slate-500">
                Released
              </Text>
              <Text className="font-semibold">{publicationYear}</Text>
            </View>
            <View className="felx gap-1">
              <Text className="font-semibold text-xl text-slate-500">
                Pages
              </Text>
              <Text className="self-end font-semibold">{pageCount}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CardFront;
