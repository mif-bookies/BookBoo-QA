import React from "react";
import { Image, Text, View } from "react-native";
import { BookDescription } from "./BookDescription";
import GenreIconList from "./GenreIconList";
import StarRatingDisplay from "./StarRatingDisplay";

interface Props {
  title: string;
  authors: string[];
  averageRating: number;
  ratingsCount: number;
  description: string;
  genres: string[];
  pageCount?: number;
  publicationYear?: number;
  coverImage: string;
}

const BookDetails = ({
  authors,
  averageRating,
  coverImage,
  description,
  genres,
  ratingsCount,
  title,
  pageCount,
  publicationYear,
}: Props) => {
  return (
    <>
      <Image
        source={{ uri: coverImage }}
        style={{ width: "100%", height: 300 }}
        resizeMode="contain"
        className="justify-center h-full rounded-lg"
      />
      <Text className="text-3xl font-semibold py-2 self-center text-center">
        {title}
      </Text>
      <Text className="text-lg text-slate-500 self-center">{authors}</Text>
      <View className="flex flex-row gap-2 justify-center items-center">
        <StarRatingDisplay
          rating={averageRating}
          starSize={30}
          color="#e87400"
        />
        <Text className="text-2xl py-2">{averageRating}</Text>
      </View>
      <Text className="text-lg text-slate-500 self-center">
        {ratingsCount} ratings
      </Text>
      <BookDescription description={description} />
      <View className="flex flex-col mt-2">
        <GenreIconList genres={genres} count={0} />
        {pageCount && (
          <Text className="text-lg text-slate-500">{pageCount} pages</Text>
        )}
        {publicationYear && (
          <Text className="text-lg text-slate-500">
            First published in {publicationYear}
          </Text>
        )}
      </View>
    </>
  );
};

export default BookDetails;
