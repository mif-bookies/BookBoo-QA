import Divider from "@/components/Divider";
import { Input } from "@/components/Input";
import MascotImage from "@/components/MascotImage";
import { OAuthButtons } from "@/components/OAuthButton";
import { useSignUp } from "@clerk/clerk-expo";
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
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return null;

    try {
      if (password !== repeatPassword) {
        throw new Error("Passwords do not match");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }

    try {
      await signUp.create({
        username: username,
        emailAddress: email,
        password: password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/discover");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {!pendingVerification ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full flex justify-center items-center px-5">
            <Text className="text-3xl font-bold mt-8 mb-2">Join BookBoo!</Text>
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
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={(email) => setEmail(email)}
              />
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={(password) => setPassword(password)}
              />
              <Input
                placeholder="Repeat password"
                secureTextEntry
                onChangeText={(repeatPassword) =>
                  setRepeatPassword(repeatPassword)
                }
              />
              <Pressable
                android_ripple={{ color: "rgba(0,0,0,0.1)" }}
                className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50"
                style={{ borderRadius: 8 }}
                onPress={() => {
                  onSignUpPress();
                }}
              >
                <Text className="text-white text-md font-medium">Submit</Text>
              </Pressable>
            </View>
            <Text className="text-sm my-5">
              Already have an account?{" "}
              <Link href={"/login"} asChild>
                <Text className="text-blue-500 font-medium">Log In</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      ) : (
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
              Verify your email
            </Text>
            <Text className="text-xl text-slate-500 text-center px-3 pb-10">
              We've sent a verification code to your email. Please enter it
              below.
            </Text>
            <View className="flex items-center gap-4 w-full">
              <Input
                placeholder="Verification code"
                onChangeText={(text) => setCode(text)}
                keyboardType="number-pad"
              />
              <Pressable
                android_ripple={{ color: "rgba(0,0,0,0.1)" }}
                className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50"
                style={{ borderRadius: 8 }}
                onPress={onPressVerify}
              >
                <Text className="text-white text-md font-medium">Verify</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default Page;
