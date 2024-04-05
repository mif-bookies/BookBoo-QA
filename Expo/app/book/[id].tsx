import BookDetails from "@/components/BookDetails";
import BookDetailsSkeleton from "@/components/BookDetailsSkeleton";
import DropdownComponent from "@/components/Dropdown";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import { Book } from "@/entities/book";
import { api } from "@/libs/axios/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

const Page = () => {
  let { id } = useLocalSearchParams();
  id = Array.isArray(id) ? id[0] : id;

  const [method, setMethod] = React.useState("Content-Based");
  const [count, setCount] = React.useState("5");
  useEffect(() => {
    if (method === "Content-Based") {
      setCount("5");
    }
  }, [method]);

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
  };

  const handleCountChange = (newCount: string) => {
    setCount(newCount);
  };

  const {
    data: book,
    isLoading: detailsLoading,
    error: detailsError,
  } = useBookDetails(id);
  const {
    data: recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
  } = useBookRecommendations(id, method, count);

  if (detailsError) {
    return <Text>Error: {detailsError.message}</Text>;
  }

  if (!book) {
    return <Text>Book not found</Text>;
  }

  return (
    <ScrollView className="flex flex-col px-5" contentContainerClassName="py-8">
      {detailsLoading ? <BookDetailsSkeleton /> : <BookDetails {...book} />}
      <View className="flex flex-col gap-2 my-3">
        <View className="flex-1 h-0.5 bg-gray-300 my-2" />
        <Text className="self-center font-semibold text-xl">
          Similar Book Recommendations
        </Text>
        <DropdownComponent
          schema={methodSchema}
          onValueChange={handleMethodChange}
        />
        {method !== "Content-Based" && (
          <DropdownComponent
            schema={countSchema}
            onValueChange={handleCountChange}
          />
        )}
        <View className="flex-1 h-0.5 bg-gray-300 my-2" />
      </View>
      {recommendationsLoading ? (
        Array.from({ length: Number(count) }).map((_, index) => (
          <ListItemSkeleton key={`skeleton-${index}`} />
        ))
      ) : recommendationsError ? (
        <Text>Error: {recommendationsError.message}</Text>
      ) : (
        recommendations?.map((book) => <ListItem {...book} key={book.id} />)
      )}
    </ScrollView>
  );
};

export default Page;

const methodSchema = [
  {
    label: "Content-Based",
    description: "Content-Based",
  },
  {
    label: "Collaborative",
    description: "Collaborative",
  },
  {
    label: "Hybrid",
    description: "Hybrid",
  },
];

const countSchema = [
  {
    label: "Book Count: 5",
    description: "5",
  },
  {
    label: "Book Count: 10",
    description: "10",
  },
  {
    label: "Book Count: 15",
    description: "15",
  },
];

const useBookDetails = (bookId: string) => {
  const { data, isLoading, error } = useQuery<Book>({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookDetails(bookId),
    enabled: !!bookId,
  });
  return { data, isLoading, error };
};

const fetchBookDetails = async (bookId: string) => {
  const { data } = await api.get(`/api/book/${bookId}`);
  return data;
};

const useBookRecommendations = (
  bookId: string,
  method: string,
  count: string
) => {
  const { data, isLoading, error } = useQuery<Book[]>({
    queryKey: ["recommendations", bookId, method, count],
    queryFn: () => fetchBookRecommendations(bookId, method, count),
    enabled: !!bookId && !!method && !!count,
  });

  return { data, isLoading, error };
};

const fetchBookRecommendations = async (
  bookId: string,
  method: string,
  count: string
) => {
  const { data } = await api.get(
    `/api/recommend?book_id=${bookId}&method=${method}&limit=${count}`
  );
  return data;
};
