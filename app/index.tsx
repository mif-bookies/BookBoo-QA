import welcomeImage from "@/assets/images/BookBoo.webp";
import NavButton from "@/components/NavButton";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const Page = () => {
  return (
    <View className="flex justify-center items-center py-20">
      <Image
        source={{ uri: welcome_image }}
        style={{ width: 300, height: 300 }}
        className=""
      />
      <Text className="font-bold text-3xl">BookBoo</Text>
      <Text className="text-xl text-slate-500">Your digital library</Text>
      <NavButton text="Get Started" link="/" />
    </View>
  );
};

export default Page;
