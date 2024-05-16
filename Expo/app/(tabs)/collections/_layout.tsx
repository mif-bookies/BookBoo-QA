import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Collections",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="public"
        options={{
          headerTitle: "Public Collections",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="private"
        options={{
          headerTitle: "Your Collections",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="[collectionId]"
        options={{
          headerTitle: "Your Collections",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default Layout;
