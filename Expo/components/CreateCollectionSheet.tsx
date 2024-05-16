import { api } from "@/libs/axios/api";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ForwardedRef, forwardRef, useMemo, useState } from "react";
import { Keyboard, Pressable, Switch, Text, View } from "react-native";

interface CreateCollectionSheetProps {
  userId: string;
}

const CreateCollectionSheet = forwardRef<
  BottomSheet,
  CreateCollectionSheetProps
>(({ userId }, ref: ForwardedRef<BottomSheet>) => {
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newCollection: {
      name: string;
      user_id: string;
      public: boolean;
    }) => api.post("/api/collection", newCollection),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCollections", userId] });
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
      Keyboard.dismiss();
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      name,
      user_id: userId,
      public: isPublic,
    });
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <View style={{ padding: 20 }}>
        <Text className="font-medium text-xl">Collection Title</Text>
        <BottomSheetTextInput
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={name}
          placeholder="Wishlist"
          onChangeText={setName}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch value={isPublic} onValueChange={setIsPublic} />
          <Text className="font-medium">Public</Text>
        </View>
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          className=" flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
          style={{ borderRadius: 8 }}
          onPress={handleSubmit}
        >
          <Text className="text-white text-md font-medium">
            Create Collection
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
});

export default CreateCollectionSheet;
