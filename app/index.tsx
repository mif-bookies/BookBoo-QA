import welcomeImage from "@/assets/images/BookBoo.webp";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const Page = () => {
  return (
    <View className="flex flex-col justify-between items-center py-20 h-full max-w-screen-sm">
      <View className="flex flex-col items-center">
        <Image
          source={{ uri: welcome_image }}
          style={{ width: 300, height: 300 }}
        />
        <Text className="font-bold text-3xl text-center pb-3">BookBoo</Text>
        <Text className="text-xl text-slate-500 text-center px-3">
          With Boo's whimsical wisdom, finding your next favorite book is just a
          wisp away. Let's embark on a magical journey through the pages
          together!
        </Text>
      </View>
      <View className="flex flex-row justify-between gap-4">
        <Link href={"/login"} asChild>
          <Pressable
            className="flex items-center justify-center text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 bg-blue-500 hover:bg-primary/90 h-11 px-16 py-2"
            style={{ borderRadius: 8 }}
          >
            <Text className="text-white text-md font-medium">Sign In</Text>
          </Pressable>
        </Link>
        <Link href={"/discover"} asChild>
          <Pressable
            className="flex items-center justify-center text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-background h-11 px-16 py-2"
            style={{ borderRadius: 8 }}
          >
            <Text className="text-black text-md font-medium">Explore</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Page;
