import React from "react";
import { Text, View } from "react-native";
import GenreIconList from "./GenreIconList";

interface Props {
  genres: string[];
  publicationYear: number;
  pageCount?: number;
  description: string;
}

const CardBack = ({
  genres,
  publicationYear,
  pageCount,
  description,
}: Props) => {
  return (
    <View className="flex flex-col gap-2 my-5 shadow-lg rounded-2xl px-3 py-6 bg-white min-h-[35rem] max-h-[35rem]">
      <View className="flex flex-row max-w-full justify-between text-center gap-4">
        <GenreIconList genres={genres} />
        <View className="flex flex-col">
          <Text className="text-md font-semibold self-end text-slate-500">
            ({publicationYear})
          </Text>
          <Text className="text-md font-semibold text-slate-500">
            {pageCount} pages
          </Text>
        </View>
      </View>
      <Text
        className="text-md font-semibold text-gray-800 text-justify"
        numberOfLines={24}
      >
        {description}
      </Text>
    </View>
  );
};

export default CardBack;
