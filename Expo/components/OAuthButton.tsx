import { useOAuth } from "@clerk/clerk-expo";
import type { OAuthProvider } from "@clerk/types";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, Text } from "react-native";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  strategy: OAuthProvider;
  type: string;
  icon: keyof typeof AntDesign.glyphMap;
}

export function OAuthButtons({ strategy, type, icon }: Props) {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({
    strategy: `oauth_${strategy}`,
    redirectUrl: "exp://localhost:8081",
  });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        if (!setActive) return;
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Pressable
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      className="flex-1 flex flex-row items-center justify-center border border-slate-300 py-2 rounded-md space-x-6 mr-1"
      onPress={onPress}
    >
      <AntDesign name={icon} size={24} color="black" />
      <Text className="text-sm font-medium ml-2">{type}</Text>
    </Pressable>
  );
}
