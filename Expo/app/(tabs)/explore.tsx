import { Input } from "@/components/Input";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import { Book } from "@/entities/book";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/libs/axios/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Button, FlatList, Text, View } from "react-native";

interface SearchResults {
  count: number;
  next: string | null;
  results: Book[];
}

const ListItemMemo = React.memo(ListItem);

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 1500 });

  const handleChange = (newValue: string) => {
    setSearchTerm(newValue);
  };

  const fetchBooks = async (page: number = 1) => {
    const response = await api.get<SearchResults>(
      `/api/book/search?query=${encodeURIComponent(
        debouncedSearchTerm
      )}&page=${page}`
    );
    return response.data;
  };

  const {
    data,
    isSuccess,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  } = useInfiniteQuery<SearchResults, AxiosError>({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const pageNumber = typeof pageParam === "number" ? pageParam : 1;
      return fetchBooks(pageNumber);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    enabled: !!debouncedSearchTerm,
    initialPageParam: 1,
  });

  const renderSkeletons = () =>
    Array.from({ length: 5 }, (_, index) => (
      <ListItemSkeleton key={`skeleton-${index}`} />
    ));

  return (
    <View
      className={`flex flex-col h-full px-5 py-3 gap-4 ${
        isError || isSuccess ? "justify-start" : "justify-center"
      }`}
    >
      <Text className="text-3xl font-semibold self-center">
        Find Your Perfect Book
      </Text>
      <Input
        placeholder="Search for books..."
        className="self-center text-center w-9/12"
        onChangeText={handleChange}
        value={searchTerm}
        numberOfLines={1}
      />
      {isLoading ? (
        <>
          <View className="h-5 w-1/4 bg-neutral-200 my-1 rounded px-5 mt-2" />
          <FlatList
            data={renderSkeletons()}
            renderItem={({ item }) => item}
            keyExtractor={(_, index) => `skeleton-${index}`}
          />
        </>
      ) : isError ? (
        <View className="mt-4">
          <Text>
            Error: {(error.response?.data as any)?.error || "An error occurred"}
          </Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : isSuccess && data ? (
        <>
          <Text className="text-lg px-5 mt-2">
            Found {data.pages[0].count} books
          </Text>
          <FlatList
            data={data.pages.flatMap((page) => page.results)}
            renderItem={({ item }) => <ListItemMemo {...item} />}
            keyExtractor={(item) => `${item.id}`}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isFetchingNextPage ? renderSkeletons : null}
          />
        </>
      ) : null}
    </View>
  );
};

export default Page;
