import Divider from "@/components/Divider";
import { Input } from "@/components/Input";
import MascotImage from "@/components/MascotImage";
import { OAuthButtons } from "@/components/OAuthButton";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const Page = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return null;

    try {
      const completeSignIn = await signIn.create({
        identifier: username,
        password: password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      router.push("/discover");
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full flex justify-center items-center px-5">
          <Text className="text-3xl font-bold mt-8 mb-2">
            Welcome to BookBoo!
          </Text>
          <MascotImage height={200} width={200} marginBottom={8} />
          <Text className="text-xl text-slate-500 text-center px-3 pb-10">
            Let's embark on a magical journey through the pages together!
          </Text>
          <View className="flex items-center gap-4 w-full">
            <View className="w-full flex flex-row justify-between gap-2">
              <OAuthButtons strategy="google" type="Google" icon="google" />
              <OAuthButtons strategy="github" type="GitHub" icon="github" />
            </View>
            <Divider />
            <Input
              placeholder="Username"
              onChangeText={(username) => setUsername(username)}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
            />
            <View className="w-full flex-row justify-end">
              <Text className="text-blue-500 text-sm font-medium">
                Forgot Password?
              </Text>
            </View>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50"
              style={{ borderRadius: 8 }}
              onPress={() => {
                onSignInPress();
              }}
            >
              <Text className="text-white text-md font-medium">Submit</Text>
            </Pressable>
          </View>
          <Text className="text-sm my-5">
            Don't have an account?{" "}
            <Link href={"/signup"} asChild>
              <Text className="text-blue-500 font-medium">Sign Up</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Page;
