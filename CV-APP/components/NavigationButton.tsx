import React from "react";
import { TouchableOpacity, Text } from "react-native";
/////////////////

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export const NavigationButton = ({
  title,
  onPress,
  variant = "primary",
}: NavigationButtonProps) => {
  const buttonClass = variant === "primary"
    ? "bg-blue-500"
    : variant === "secondary"
    ? "bg-transparent border-2 border-blue-500"
    : "bg-red-500";

  const textClass = variant === "secondary" ? "text-blue-500" : "text-white";

  return (
    <TouchableOpacity
      className={`${buttonClass} py-4 px-8 rounded-lg items-center justify-center my-2`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className={`${textClass} text-lg font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
};
