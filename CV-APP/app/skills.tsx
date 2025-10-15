// app/skills.tsx

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Habilidad</Text>

        {/* Conecta los campos del formulario con Controller */}
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
          <Text style={{ color: 'red', marginBottom: 8 }}>
            {errors.name.message}
          </Text>
        )}

        <Text style={styles.label}>Nivel</Text>
        <View style={styles.selectContainer}>
          {skillLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.selectedLevelButton,
              ]}
              onPress={() => setValue("level", level)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  selectedLevel === level && styles.selectedLevelButtonText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <NavigationButton title="Agregar Habilidad" onPress={handleSubmit(onSubmit)} />

        {cvData.skills.length > 0 && (
          <>
            <Text style={styles.listTitle}>Habilidades Agregadas</Text>
            {cvData.skills.map((skill) => (
              <View key={skill.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{skill.name}</Text>
                  <Text style={styles.cardSubtitle}>{skill.level}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(skill.id)}
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
  label: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 8,
    fontWeight: "500",
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  levelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#ecf0f1",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedLevelButton: {
    backgroundColor: "#3498db",
  },
  levelButtonText: {
    color: "#2c3e50",
  },
  selectedLevelButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
