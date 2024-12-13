"use strict";

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {onRequest} = require("firebase-functions/v2/https");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
// [END import]

// Cloud Function para procesar formulario y enviar datos a una API externa
exports.submitFormu = onRequest(async (req, res) => {
  // Validar que la solicitud sea POST
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido. Usa POST.");
  }

  try {
    // Obtener datos del formulario desde el cuerpo de la solicitud
    const {name, phone, sede, dateTime} = req.body;

    // Validar campos requeridos
    if (!name || !phone || !sede || !dateTime) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Construir el payload para la API externa
    const payload = {
      name: name,
      phone: phone,
      sede: sede,
      dateTime: dateTime,
    };

    const writeResult = await getFirestore()
      .collection("mail")
      .add({
        to: "juanito.campoverde@gmail.com; npulles08@hotmail.com; andradehans88@gmail.com",
        message: {
          html:
            " Hola, hay una nueva reserva! :D<br /><br />" +
            "Nombre: " +
            payload.name +
            "<br />Teléfono: " +
            payload.phone +
            "<br />Sede: " +
            payload.sede +
            "<br />Fecha: " +
            payload.dateTime,
          subject: "Nueva cita reservada!",
          text: "Mail desde firebase",
        },
      });
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return res.status(500).send({
      error: "Hubo un problema al procesar la solicitud.",
      details: error.message,
    });
  }
});
