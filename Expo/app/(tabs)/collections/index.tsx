import CollectionLink from "@/components/CollectionLink";
import { useAuth } from "@clerk/clerk-expo";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons/faSquarePlus";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Page = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <View className="flex max-w-full h-screen py-8 px-5 gap-2 justify-between">
      <View className="flex-1 gap-4">
        <CollectionLink
          path="collections/public"
          icon={faSquarePlus}
          iconColor="#3b82f6"
          label="Public Collections"
        />

        {isSignedIn && (
          <CollectionLink
            path="collections/private"
            icon={faHeart}
            iconColor="#dc2626"
            label="Your Collections"
          />
        )}
      </View>
      <View
        className="bg-blue-500 h-52 w-full mb-32 flex flex-col items-center justify-center gap-3"
        style={{ borderRadius: 8 }}
      >
        <Text className="text-white text-xl font-semibold">
          Swipe Your Way to New Books
        </Text>
        <Text className="text-white font-medium">
          Explore titles in a fun and interactive way
        </Text>
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          className="items-center justify-center bg-white rounded-lg px-8 py-2 text-sm font-medium"
          style={{ borderRadius: 8 }}
          onPress={() => {
            router.push({
              pathname: "/discover",
            });
          }}
        >
          <Text className="text-blue-500 font-medium">Start Swiping</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Page;
