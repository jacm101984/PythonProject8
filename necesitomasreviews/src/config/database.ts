const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    // Usar cadena de conexión explícita con IPv4
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/necesitomasreviews';
    console.log(`Intentando conectar a MongoDB en: ${mongoUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Forzar IPv4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    // Evitamos que termine la aplicación para que puedas seguir desarrollando
    console.warn("La aplicación continuará sin conexión a la base de datos");
  }
};

module.exports = { connectDB };