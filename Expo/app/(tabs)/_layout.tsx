import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#333",
        tabBarActiveBackgroundColor: "#f3f4f6",
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color }) => (
            <Fontisto name="zoom" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color }) => (
            <Feather name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
