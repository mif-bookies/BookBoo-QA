import { Book } from "@/entities/book";
import React from "react";
import { View } from "react-native";
import CardBack from "./CardBack";
import CardFront from "./CardFront";

interface Props extends Book {
  isVisible: boolean;
}

const Card = ({
  id,
  title,
  coverImage,
  averageRating,
  genres,
  publicationYear,
  pageCount,
  description,
  isVisible,
}: Props) => {
  return (
    <View key={id}>
      {!isVisible ? (
        <CardFront
          {...{
            id,
            title,
            coverImage,
            averageRating,
            publicationYear,
            pageCount,
          }}
        />
      ) : (
        <CardBack {...{ genres, publicationYear, pageCount, description }} />
      )}
    </View>
  );
};

export default Card;
