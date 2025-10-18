// app/photo.tsx

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";

export default function PhotoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    cvData.personalInfo.profileImage
  );

  // Solicitar permisos y tomar foto con la cámara
  const takePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu cámara para tomar fotos."
        );
        return;
      }

      // Abrir la cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Aspecto cuadrado
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
      console.error(error);
    }
  };

  // Seleccionar foto de la galería
  const pickImage = async () => {
    try {
      // Solicitar permisos de galería
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!galleryPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu galería para seleccionar fotos."
        );
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería");
      console.error(error);
    }
  };

  // Guardar la foto
  const handleSave = () => {
    updatePersonalInfo({
      ...cvData.personalInfo,
      profileImage: selectedImage,
    });
    Alert.alert("Éxito", "Foto guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Eliminar foto
  const handleRemove = () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setSelectedImage(undefined);
          updatePersonalInfo({
            ...cvData.personalInfo,
            profileImage: undefined,
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800 text-center mb-5">Foto de Perfil</Text>

      <View className="items-center mb-8">
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className="w-52 h-52 rounded-full border-4 border-blue-500"
          />
        ) : (
          <View className="w-52 h-52 rounded-full bg-gray-300 justify-center items-center border-4 border-gray-400">
            <Text className="text-gray-500 text-base">Sin foto</Text>
          </View>
        )}
      </View>

      <View className="mb-5">
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-3 items-center"
          onPress={takePhoto}
        >
          <Text className="text-white text-base font-semibold">📷 Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-3 items-center"
          onPress={pickImage}
        >
          <Text className="text-white text-base font-semibold">🖼️ Seleccionar de Galería</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-lg mb-3 items-center"
            onPress={handleRemove}
          >
            <Text className="text-white text-base font-semibold">🗑️ Eliminar Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      <NavigationButton title="Guardar" onPress={handleSave} />

      <NavigationButton
        title="Cancelar"
        onPress={() => router.back()}
        variant="secondary"
      />
    </View>
  );
}

