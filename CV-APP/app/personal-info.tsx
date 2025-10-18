// app/personal-info.tsx

import React, { useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

import { useForm, Controller } from "react-hook-form";  // Importamos useForm y Controller


export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: cvData.personalInfo,  // Establecemos los valores iniciales
  });

  // Usamos useEffect para actualizar los valores del formulario cuando cambie el estado global
  useEffect(() => {
    setValue("fullName", cvData.personalInfo.fullName);
    setValue("email", cvData.personalInfo.email);
    setValue("phone", cvData.personalInfo.phone);
    setValue("location", cvData.personalInfo.location);
    setValue("summary", cvData.personalInfo.summary);
  }, [cvData.personalInfo, setValue]);

  // Función para manejar la validación y guardado
  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Manejo de errores
  const onError = () => {
    Alert.alert("Error", "Por favor completa todos los campos requeridos.");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        {/* Nombre Completo */}
        <Controller
          name="fullName"
          control={control}

          rules={{
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Validación para que solo permita letras y espacios
              message: "El nombre solo puede contener letras y espacios",
            },
          }}


          render={({ field: { value, onChange } }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Juan Pérez"
              value={value}
              onChangeText={onChange}

              error={errors.fullName?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}

          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: "Formato de email no válido",  // Validación de email
            },
          }}


          render={({ field: { value, onChange } }) => (
            <InputField
              label="Email *"
              placeholder="juan@email.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              
              error={errors.email?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Teléfono */}
        <Controller
          name="phone"
          control={control}
          
          rules={{
            pattern: {
              value: /^[0-9]{1,10}$/,  // Solo números y máximo 10 dígitos
              message: "El teléfono solo puede contener hasta 10 dígitos",
            },
          }}


          render={({ field: { value, onChange } }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"

              error={errors.phone?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Ubicación */}
        <Controller
          name="location"
          control={control}

          rules={{
            
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s,]+$/,  // Solo letras y espacios
              message: "La ubicación solo puede contener letras y espacios",
            },
          }}


          render={({ field: { value, onChange } }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={value}
              onChangeText={onChange}

              error={errors.location?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Resumen Profesional */}
        <Controller
          name="summary"
          control={control}

          rules={{
            
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { value, onChange } }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Describe brevemente tu perfil profesional..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}

              error={errors.summary?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Botón de Guardar */}
        <NavigationButton title="Guardar Información" onPress={handleSubmit(onSubmit, onError)} />

        {/* Botón de Cancelar */}
        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}


