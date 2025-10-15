// app/index.tsx

import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;

  const hasSkills = cvData.skills.length > 0;


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Crea tu CV Profesional</Text>

      {/* Sección: Foto de Perfil */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>Foto de Perfil</Text>
            <Text style={styles.status}>
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              style={styles.thumbnail}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/photo")}
        >
          <Text style={styles.buttonText}>
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Información Personal</Text>
        <Text style={styles.status}>
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/personal-info")}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Experiencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Experiencia</Text>
        <Text style={styles.status}>
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/experience")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Educación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Educación</Text>
        <Text style={styles.status}>
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/education")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>


      {/* Sección: Habilidades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Habilidades</Text>
        <Text style={styles.status}>
          {hasSkills
            ? `✓ ${cvData.skills.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/skills")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>



      

      {/* Botón de Vista Previa - Más grande y visible */}
      <View style={styles.previewSection}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
        >
          <Text style={styles.previewButtonIcon}>👁️</Text>
          <Text style={styles.previewButtonText}>Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>

      {/* Espacio adicional al final para evitar que el último elemento quede oculto */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Espacio extra al final
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#27ae60",
    marginBottom: 12,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  previewSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewButton: {
    backgroundColor: "#2ecc71",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  previewButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 20,
  },
});

