import welcomeImage from "@/assets/images/BookBoo.webp";
import React from "react";
import { Image, ImageStyle } from "react-native";

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

interface Props {
  width: number;
  height: number;
  style?: ImageStyle;
}

const MascotImage = ({ width, height, style, ...rest }: Props & ImageStyle) => {
  return (
    <Image
      source={{ uri: welcome_image }}
      style={[{ width, height }, style, rest]}
    />
  );
};

export default MascotImage;
