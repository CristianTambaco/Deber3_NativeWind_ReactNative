import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, ...props }: InputFieldProps) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-2">{label}</Text>
      <TextInput
        className={`
          border rounded-lg p-3 text-base bg-white 
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};
