// src/scripts/list-users.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User'; // Ajusta la ruta según tu estructura

// Cargar variables de entorno
dotenv.config();

async function listUsers() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews');
    console.log('Conectado a MongoDB');

    // Buscar usuarios
    const users = await User.find({}, 'email name role isVerified createdAt -_id');

    console.log('=== USUARIOS REGISTRADOS ===');
    console.table(users);

    // Desconectar
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al listar usuarios:', error);
  }
}

listUsers();