// app/skills.tsx

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
import { Skill, SkillLevel } from "../types/cv.types";

import { useForm, Controller } from "react-hook-form";


const skillLevels: SkillLevel[] = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

// Define los tipos del formulario
type FormValues = {
  name: string;
  level: SkillLevel;
};

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, deleteSkill } = useCVContext();

  // Inicializa React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      level: 'Básico',
    },
  });

  const selectedLevel = watch('level');

  const onSubmit = (data: FormValues) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: data.name.trim(),
      level: data.level,
    };

    addSkill(newSkill);
    reset(); // limpia el formulario

    Alert.alert("Éxito", "Habilidad agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta habilidad?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteSkill(id),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Agregar Nueva Habilidad
        </Text>

        {/* Conecta los campos del formulario con Controller */}
        {/* Campo de Nombre de Habilidad */}
        <Controller
          control={control}
          name="name"

          rules={{ 
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,  // Solo letras y espacios
              message: "El campo solo puede contener letras y espacios",
            }, 
          
          }}

          render={({ field: { onChange, value } }) => (
            <InputField
              label="Nombre de la habilidad *"
              placeholder="Ej: JavaScript, Figma, React"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 mb-2">{errors.name.message}</Text>
        )}

        {/* Botones de Nivel */}
        <Text className="text-sm font-medium text-gray-800 mb-2">Nivel</Text>
        <View className="flex-row flex-wrap mb-4">
          {skillLevels.map((level) => {
            const isSelected = selectedLevel === level;
            return (
              <TouchableOpacity
                key={level}
                className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${
                  isSelected ? "bg-blue-500" : "bg-gray-200"
                }`}
                onPress={() => setValue("level", level)}
              >
                <Text
                  className={`${
                    isSelected
                      ? "text-white font-bold"
                      : "text-gray-800"
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <NavigationButton title="Agregar Habilidad" onPress={handleSubmit(onSubmit)} />

        {/* Lista de Habilidades */}
        {cvData.skills.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              Habilidades Agregadas
            </Text>
            {cvData.skills.map((skill) => (
              <View
                key={skill.id}
                className="bg-white rounded-lg p-4 mb-3 flex-row shadow-sm shadow-black/10 elevation-2"
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {skill.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{skill.level}</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 bg-red-500 rounded-full justify-center items-center"
                  onPress={() => handleDelete(skill.id)}
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


