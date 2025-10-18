import * as FileSystem from "expo-file-system/legacy";

import * as Print from "expo-print";


export const generateCVHtml = (cvData: any, base64Image?: string) => {
  const { personalInfo, education, experiences, skills } = cvData;

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2c3e50; }
          h2 { color: #1D4ED8; border-bottom: 1px solid #157bc0ff; padding-bottom: 4px; }
          p { margin: 4px 0; }

          /* Contenedor para la imagen y los datos personales */
          .personal-info-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          /* Estilos para la imagen */
          .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 60px;
            object-fit: cover;
            margin-right: 20px; /* Espacio entre la imagen y los datos */
          }

          /* Estilos para los datos personales */
          .personal-details {
            flex: 1; /* Esto hace que el contenedor ocupe el espacio restante */
          }
        </style>
      </head>
      <body>

        <!-- Contenedor para la imagen y los datos -->
        <div class="personal-info-container">
          ${
            base64Image
              ? `<img class="profile-image" src="data:image/*;base64,${base64Image}" />`
              : ""
          }
          <div class="personal-details">
            <h1>${personalInfo.fullName}</h1>
            <p>📧 Email: ${personalInfo.email}</p>
            <p>📱 Teléfono: ${personalInfo.phone}</p>
            <p>📍 Ubicación: ${personalInfo.location}</p>
          </div>
        </div>

        ${
          personalInfo.summary
            ? `
            <h2>Resumen Profesional</h2>
            <p>${personalInfo.summary}</p>
            `
            : ""
        }

        <h2>Experiencia Laboral</h2>
        ${experiences.map(
          (exp: any) => `
          <p><strong>${exp.position}</strong></p>
          <p>${exp.company}</p>
          <p>${exp.startDate} - ${exp.endDate || "Actual"}</p>
          <p>${exp.description}</p>
        `
        ).join("")}

        <h2>Educación</h2>
        ${education.map(
          (edu: any) => `
          <p><strong>${edu.degree}</strong></p>
          <p>${edu.field}</p>
          <p>${edu.institution}</p>
          <p>${edu.graduationYear}</p>
        `
        ).join("")}

        <h2>Habilidades Técnicas</h2>
        ${skills.map(
          (skill: any) => `
          <p><strong>${skill.name}</strong></p>
          <p>Nivel: ${skill.level}</p>
        `
        ).join("")}
      </body>
    </html>
  `;
};

export const generatePdf = async (cvData: any) => {
  let base64Image = "";

  try {
    const imageUri = cvData?.personalInfo?.profileImage;

    if (imageUri && imageUri.startsWith("file://")) {
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
    }

  } catch (error) {
    console.warn("No se pudo convertir la imagen a base64:", error);
  }

  const html = generateCVHtml(cvData, base64Image);
  const { uri } = await Print.printToFileAsync({ html });

  return uri;
};
