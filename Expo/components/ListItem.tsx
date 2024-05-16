import { Book } from "@/entities/book";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import GenreIconList from "./GenreIconList";

type Subset<T extends U, U> = U;

type Props = Subset<
  Book,
  {
    id: number;
    title: string;
    coverImage: string;
    authors: string[];
    genres: string[];
  }
> & {
  onLongPress?: (id: number, title: string) => void;
};

const ListItem = ({
  id,
  title,
  coverImage,
  authors,
  genres,
  onLongPress,
}: Props) => {
  const router = useRouter();
  const bookId = String(id);

  const handlePress = () => {
    router.navigate({
      pathname: "/book/[id]",
      params: { id: bookId },
    });
  };

  return (
    <View className="flex gap-2">
      <Pressable
        android_ripple={{ color: "rgba(0,0,0,0.2)" }}
        onPress={handlePress}
        onLongPress={() => onLongPress?.(id, title)}
        className="py-3"
      >
        <View className="flex flex-row gap-2">
          <Image
            source={{ uri: coverImage }}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          <View className="flex-1 gap-2 min-w-0">
            <Text
              className="text-xl font-semibold overflow-hidden"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text className="text-lg text-slate-500">{authors[0]}</Text>
            <GenreIconList genres={genres} />
          </View>
        </View>
      </Pressable>
      <View className="flex-1 h-0.5 bg-gray-300 my-2" />
    </View>
  );
};

export default ListItem;
