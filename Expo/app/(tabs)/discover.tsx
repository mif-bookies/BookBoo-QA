import Card from "@/components/Card";
import CardSkeleton from "@/components/CardSkeleton";
import { Book } from "@/entities/book";
import { api } from "@/libs/axios/api";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Swiper from "react-native-deck-swiper";

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const swiperRef = useRef<Swiper<any>>(null);

  const { data: initialBooks, isSuccess } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  useEffect(() => {
    if (isSuccess) {
      setBooks(initialBooks);
    }
  }, [initialBooks, isSuccess]);

  const fetchMoreBooks = async () => {
    const newBooks = await fetchBooks();
    setBooks((prevBooks) => {
      const newBookIds = new Set(newBooks.map((book) => book.id));
      const filteredPrevBooks = prevBooks.filter(
        (book) => !newBookIds.has(book.id)
      );
      return [...filteredPrevBooks, ...newBooks];
    });
  };

  const onSwiped = (cardIndex: number) => {
    if (cardIndex >= books.length - 3) {
      fetchMoreBooks();
    }
  };

  const [visibleStates, setVisibleStates] = useState(
    Array(books.length).fill(false)
  );

  const viewCard = (cardIndex: number) => {
    setVisibleStates((currentVisibleStates) => {
      const newVisibleStates = [...currentVisibleStates];
      newVisibleStates[cardIndex] = !newVisibleStates[cardIndex];
      return newVisibleStates;
    });
    swiperRef.current?.forceUpdate();
  };
  return (
    <View className="flex flex-1 flex-col relative">
      <CardSkeleton />
      {isSuccess && (
        <Swiper
          ref={swiperRef}
          cards={books}
          swipeBackCard={true}
          cardVerticalMargin={20}
          showSecondCard={false}
          disableLeftSwipe={currentIndex === 0}
          goBackToPreviousCardOnSwipeLeft={true}
          stackAnimationFriction={15}
          stackAnimationTension={100}
          onTapCard={(cardIndex) => {
            viewCard(cardIndex);
          }}
          renderCard={(card, cardIndex) => {
            return <Card {...card} isVisible={visibleStates[cardIndex]} />;
          }}
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => setCurrentIndex(cardIndex - 1)}
          onSwipedRight={(cardIndex) => setCurrentIndex(cardIndex + 1)}
          onSwiped={onSwiped}
          cardIndex={0}
          backgroundColor={"transparent"}
          stackSize={5}
        />
      )}
      <View className="flex flex-row gap-2 absolute left-0 right-0 bottom-4 justify-center">
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          className=" flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-background h-11 px-8 py-2"
          style={{ borderRadius: 8 }}
          onPress={() => swiperRef.current?.swipeLeft()}
          disabled={currentIndex === 0}
        >
          <FontAwesomeIcon icon={faAngleLeft} size={28} color={"#1e293b"} />
        </Pressable>
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          className="flex items-center h-11 justify-center bg-blue-500 rounded-lg px-8 py-2 text-white text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
          style={{ borderRadius: 8 }}
          onPress={() => {
            router.push({
              pathname: "/book/[id]",
              params: { id: books[currentIndex].id },
            });
          }}
        >
          <FontAwesomeIcon icon={faEye} size={26} color={"white"} />
        </Pressable>
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          className="flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-background h-11 px-8 py-2"
          style={{ borderRadius: 8 }}
          onPress={() => swiperRef.current?.swipeRight()}
          disabled={currentIndex === books.length - 1}
        >
          <FontAwesomeIcon icon={faAngleRight} size={28} color={"#1e293b"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Page;

const fetchBooks = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>("/api/book");
  return data;
};
