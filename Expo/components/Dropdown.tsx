import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
  schema: {
    label: string;
    description: string;
  }[];
  onValueChange: (value: string) => void;
}

const DropdownComponent = ({ schema, onValueChange }: Props) => {
  const [selectedValue, setSelectedValue] = useState(schema[0]?.description);

  return (
    <View className="flex-1 justify-center items-center">
      <View
        className="rounded-md overflow-hidden bg-blue-500"
        style={{ width: 300 }}
      >
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          dropdownIconColor="white"
          style={{
            height: 50,
            width: 300,
            backgroundColor: "transparent",
            color: "white",
          }}
          onValueChange={(itemValue) => {
            setSelectedValue(itemValue);
            onValueChange(itemValue);
          }}
        >
          {schema.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.description}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default DropdownComponent;
