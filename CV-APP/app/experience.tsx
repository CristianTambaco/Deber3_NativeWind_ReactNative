// app/experience.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

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
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
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
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
