import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  path?: any;
  icon: IconProp;
  iconColor: string;
  label: string;
}

const CollectionLink = ({ path, icon, iconColor, label }: Props) => {
  const router = useRouter();

  return (
    <Pressable
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      className="gap-4"
      onPress={() => router.push({ pathname: path })}
    >
      <View className="flex flex-row justify-between items-center w-full">
        <View className="flex-row gap-3 items-center">
          <FontAwesomeIcon icon={icon} size={28} color={iconColor} />
          <Text className="font-medium">{label}</Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} />
      </View>
      <View className="flex flex-row w-full">
        <View className="flex-1 h-0.5 bg-gray-300" />
      </View>
    </Pressable>
  );
};

export default CollectionLink;
