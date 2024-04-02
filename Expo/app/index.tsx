import MascotImage from "@/components/MascotImage";
import { cn } from "@/libs/utils";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Page = () => {
  const { isSignedIn } = useAuth();
  return (
    <View className="flex flex-col justify-between items-center py-20 h-full max-w-screen-sm">
      <View className="flex flex-col items-center">
        <MascotImage height={300} width={300} />
        <Text className="font-bold text-3xl text-center pb-3">BookBoo</Text>
        <Text className="text-xl text-slate-500 text-center px-3">
          With Boo's whimsical wisdom, finding your next favorite book is just a
          wisp away. Let's embark on a magical journey through the pages
          together!
        </Text>
      </View>
      <View
        className={cn("flex flex-row gap-4", !isSignedIn && "justify-between")}
      >
        <Link href={"/login"} asChild>
          <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            className={cn(
              "flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-blue-500 hover:bg-primary/90 h-11 px-16 py-2",
              isSignedIn && "hidden"
            )}
            style={{ borderRadius: 8 }}
          >
            <Text className="text-white text-md font-medium">Sign In</Text>
          </Pressable>
        </Link>
        <Link href={"/discover"} asChild>
          <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            className={cn(
              "flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-background h-11 px-16 py-2",
              isSignedIn && "bg-blue-500"
            )}
            style={{ borderRadius: 8 }}
          >
            <Text
              className={cn(
                "text-black text-md font-medium",
                isSignedIn && "text-white"
              )}
            >
              Explore
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Page;
