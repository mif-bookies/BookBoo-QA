import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
} from "react-native";
import { Input } from "@/components/Input";
import welcomeImage from "@/assets/images/BookBoo.webp";
import { Link } from "expo-router";

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const Page = () => {
  return (
    <KeyboardAvoidingView className="flex justify-center items-center mx-5">
      <Text className="text-3xl font-bold mt-8">Join BookBoo!</Text>
      <Image
        source={{ uri: welcome_image }}
        style={{ width: 200, height: 200 }}
      />
      <Text className="text-xl text-slate-500 text-center px-3 pb-10">
        Let's embark on a magical journey through the pages together!
      </Text>
      <View className="flex items-center gap-4 w-full">
        <Input placeholder="Email" keyboardType="email-address" />
        <Input placeholder="Password" secureTextEntry />
        <Pressable
          className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50"
          style={{ borderRadius: 8 }}
          onPress={() => {
            console.log("Login");
          }}
        >
          <Text className="text-white text-md font-medium">Submit</Text>
        </Pressable>
      </View>
      <Text className="text-sm mt-5">
        Already have an account?{" "}
        <Link href={"/login"} asChild>
          <Text className="text-blue-500 font-medium">Log In</Text>
        </Link>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default Page;
