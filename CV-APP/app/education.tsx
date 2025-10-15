// app/education.tsx

import React from "react";
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

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
                <Text style={styles.errorText}>{errors.institution.message}</Text>
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
                <Text style={styles.errorText}>{errors.degree.message}</Text>
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
                <Text style={styles.errorText}>{errors.graduationYear.message}</Text>
              )}
            </>
          )}
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(handleAdd)} // Pasar la función handleAdd con validación
        />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

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
  cardInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 2,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
