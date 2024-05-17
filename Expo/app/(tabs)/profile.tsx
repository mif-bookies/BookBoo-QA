import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Page = () => {
  const { isLoaded, signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center">
      {isSignedIn && (
        <>
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-32 h-32 rounded-full mb-4"
          />
          <Text className="text-xl font-bold mb-4">{user?.fullName}</Text>
          <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium transition-colors"
            style={{ borderRadius: 8 }}
            onPress={handleSignOut}
          >
            <Text className="text-white text-md font-medium">Sign Out</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default Page;
