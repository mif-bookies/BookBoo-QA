import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  link: string;
}

const NavButton = ({ text, link }: Props) => {
  return (
    <Link
      href={link as "/"}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 h-10 px-4 py-2"
    >
      <TouchableOpacity onPress={() => {}}>
        <Text className="text-white">{text}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default NavButton;
