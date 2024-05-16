import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Keyboard, Pressable, Switch, Text, View } from "react-native";

interface Props {
  name: string;
  setName: (name: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const EditCollectionSheet = forwardRef<BottomSheet, Props>(
  ({ name, setName, isPublic, setIsPublic, handleEdit, handleDelete }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
      snapToIndex: () => {},
      snapToPosition: () => {},
      collapse: () => {},
      forceClose: () => {},
    }));

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose
      >
        <View className="p-4">
          <Text className="font-medium text-xl">Collection Title</Text>
          <BottomSheetTextInput
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={name}
            placeholder="Collection Name"
            onChangeText={setName}
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch value={isPublic} onValueChange={setIsPublic} />
            <Text className="font-medium">Public</Text>
          </View>
          <View className="gap-4">
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              className="flex items-center justify-center h-11 bg-blue-500 rounded-lg px-12 py-2 text-white text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
              style={{ borderRadius: 8 }}
              onPress={handleEdit}
            >
              <Text className="text-white text-md font-medium">
                Save Changes
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              className="flex items-center justify-center h-11 bg-red-500 rounded-lg px-12 py-2 text-white text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
              style={{ borderRadius: 8 }}
              onPress={handleDelete}
            >
              <Text className="text-white text-md font-medium">
                Delete Collection
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              className="flex items-center justify-center h-11 bg-blue-400 rounded-lg px-12 py-2 text-white text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
              style={{ borderRadius: 8 }}
              onPress={() => {
                bottomSheetRef.current?.close();
                Keyboard.dismiss();
              }}
            >
              <Text className="text-white text-md font-medium">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

export default EditCollectionSheet;
