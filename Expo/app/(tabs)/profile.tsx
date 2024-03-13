import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Button, View } from "react-native";

const Page = () => {
  const { isLoaded, signOut, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, []);

  if (!isLoaded) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <View>
      {isSignedIn && (
        <Button
          title="Sign Out"
          onPress={() => {
            handleSignOut();
          }}
        />
      )}
    </View>
  );
};

export default Page;
