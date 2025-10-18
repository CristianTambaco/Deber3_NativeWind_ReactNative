// app/education.tsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

import { useForm, Controller } from "react-hook-form"; // Importar useForm y Controller



export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  // Utilizamos react-hook-form para la validación de formulario
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }>({
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      graduationYear: '',
    }
  });

  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  // Función para manejar la adición de educación
  const handleAdd = (data: { institution: string; degree: string; field: string; graduationYear: string }) => {
    if (!data.institution || !data.degree) {
      Alert.alert("Error", "Por favor completa al menos institución y título");
      return;
    }

    const newEducation: Education = {
      id: Date.now().toString(),
      ...data,
    };

    addEducation(newEducation);

    // Limpiar formulario
    setValue("institution", '');
    setValue("degree", '');
    setValue("field", '');
    setValue("graduationYear", '');

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-xl font-bold text-slate-800 mb-4">Agregar Nueva Educación</Text>

        {/* Campo de Institución con validación */}
        <Controller
          name="institution"
          control={control}

          rules={{
            required: "La institución es obligatoria",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { onChange, value } }) => (
            <>
              <InputField
                label="Institución *"
                placeholder="Nombre de la universidad/institución"
                value={value}
                onChangeText={onChange}
              />
              {errors.institution && (
                <Text className="text-red-600 text-xs mt-1">
                  {errors.institution.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Campo de Título/Grado con validación */}
        <Controller
          name="degree"
          control={control}

          rules={{
            required: "El título es obligatorio",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { onChange, value } }) => (
            <>
              <InputField
                label="Título/Grado *"
                placeholder="Ej: Licenciatura, Maestría"
                value={value}
                onChangeText={onChange}
              />
              {errors.degree && (
                <Text className="text-red-600 text-xs mt-1">
                  {errors.degree.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Campo de Área de Estudio */}
        <Controller
          name="field"
          control={control}

          rules={{
            
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { onChange, value } }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
              error={errors.field?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Campo de Año de Graduación con validación */}
        <Controller
          name="graduationYear"
          control={control}
          rules={{
            
            pattern: {
              value: /^\d{4}$/, // Valida que sea un año en formato de 4 dígitos
              message: "Por favor ingresa un año válido (ej: 2023)",
            },
            validate: {
              notFutureYear: (value) => {
                if (parseInt(value) > currentYear) {
                  return "El año de graduación no puede mayor al año actual";
                }
                return true; // Si es válido
              },
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <InputField
                label="Año de Graduación "
                placeholder="Ej: 2023"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
              />
              {errors.graduationYear && (
                <Text className="text-red-600 text-xs mt-1">
                  {errors.graduationYear.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Botón Agregar */}
        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(handleAdd)}
        />

        {/* Lista de Educación Agregada */}
        {cvData.education.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-slate-800 mt-6 mb-3">
              Educación Agregada
            </Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow shadow-black/10">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-800 mb-1">{edu.degree}</Text>
                  <Text className="text-sm text-gray-600 mb-1">{edu.field}</Text>
                  <Text className="text-sm text-gray-500 mb-1">{edu.institution}</Text>
                  <Text className="text-xs text-gray-400">{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text className="text-white text-lg font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"          
        />
      </View>
    </ScrollView>
  );
}

