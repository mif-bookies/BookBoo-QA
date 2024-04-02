import { cn } from "@/libs/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export const BookDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxCharacters = 300;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const gradientColors = isExpanded
    ? ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]
    : ["rgba(242,242,242,0)", "rgba(242,242,242,1)"];

  return (
    <View className="relative overflow-hidden">
      <Text className={cn("text-base text-gray-500", isExpanded ? "" : "mb-5")}>
        {isExpanded
          ? description
          : `${description.substring(0, maxCharacters)}...`}
      </Text>
      {!isExpanded && (
        <LinearGradient
          colors={gradientColors}
          style={styles.gradient}
          locations={[0.5, 1]}
        />
      )}
      {!isExpanded && (
        <Pressable
          onPress={toggleExpanded}
          className="absolute bottom-0 w-full"
        >
          <Text className="text-lg p-3 font-semibold text-center color-black">
            Show More
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 350,
  },
});
