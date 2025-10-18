// app/experience.tsx

import React, { useState } from "react";
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
import { Experience } from "../types/cv.types";

import { useForm, Controller } from "react-hook-form"; // Importar useForm y Controller


export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  // Inicializar react-hook-form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  // Obtener el año actual
  const currentYear = new Date().getFullYear();
  
  // Función para manejar la adición de experiencia
  const onSubmit = (data: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...data,
    };

    addExperience(newExperience);
    Alert.alert("Éxito", "Experiencia agregada correctamente");

    // Limpiar formulario después de agregar experiencia
    reset();
  };

  // Función para manejar la eliminación de experiencia
  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-xl font-bold text-slate-800 mb-4">Agregar Nueva Experiencia</Text>

        {/* Empresa */}
        <Controller
          name="company"
          control={control}

          rules={{
            required: "La empresa es obligatoria",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { value, onChange } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              error={errors.company?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Cargo */}
        <Controller
          name="position"
          control={control}

          rules={{
            required: "El cargo es obligatorio",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { value, onChange } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              error={errors.position?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Fecha de inicio */}
        <Controller
          name="startDate"
          control={control}

          rules={{
            required: "La fecha de inicio es obligatoria",
            pattern: {
              value: /^\w+\s\d{4}$/,  // Ejemplo: "Enero 2020"
              message: "El formato de fecha no es válido (Ej: Enero 2020)",
            },
            validate: (value) => {
              // Verificar si el año es mayor que el año actual
              const year = parseInt(value.split(' ')[1], 10);
              if (year > currentYear) {
                return `El año no puede ser mayor al año actual (${currentYear})`;
              }
              return true;
            },
          }}

          render={({ field: { value, onChange } }) => (
            <InputField
              label="Fecha de Inicio *"
              placeholder="Ej: Enero 2020"
              value={value}
              onChangeText={onChange}
              error={errors.startDate?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Fecha de fin */}
        <Controller
          name="endDate"
          control={control}

          rules={{
            
            pattern: {
              value: /^\w+\s\d{4}$/,  // Ejemplo: "Diciembre 2023"
              message: "El formato de fecha no es válido (Ej: Diciembre 2023)",
            },
            validate: (value) => {
              // Verificar si el año es mayor que el año actual
              const year = parseInt(value.split(' ')[1], 10);
              if (year > currentYear) {
                return `El año no puede ser mayor al año actual (${currentYear})`;
              }
              return true;
            },
          }}


          render={({ field: { value, onChange } }) => (
            <InputField
              label="Fecha de Fin"
              placeholder="Ej: Diciembre 2023"
              value={value}
              onChangeText={onChange}
              error={errors.endDate?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Descripción */}
        <Controller
          name="description"
          control={control}

          rules={{
            
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            },
          }}

          render={({ field: { value, onChange } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}

              error={errors.description?.message}  // Mostrar mensaje de error
            />
          )}
        />

        {/* Botón Agregar */}
        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {/* Lista de experiencias agregadas */}
        {cvData.experiences.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-slate-800 mt-6 mb-3">Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow shadow-black/10">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-800 mb-1">{exp.position}</Text>
                  <Text className="text-sm text-gray-600 mb-1">{exp.company}</Text>
                  <Text className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || "Actual"}</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text className="text-white text-lg font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Botón Volver */}
        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"          
        />
      </View>
    </ScrollView>
  );
}

