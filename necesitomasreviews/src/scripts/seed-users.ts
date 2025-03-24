// src/scripts/seed-users.ts

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from '../models/User'; // Ajusta la ruta según tu estructura

// Cargar variables de entorno
dotenv.config();

async function seedUsers() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews');
    console.log('Conectado a MongoDB');

    // Crear usuarios de prueba
    const testUsers = [
      {
        name: 'Usuario Cliente',
        email: 'cliente@ejemplo.com',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        isVerified: true
      },
      {
        name: 'Usuario Promotor',
        email: 'promotor@ejemplo.com',
        password: await bcrypt.hash('password123', 10),
        role: 'PROMOTER',
        isVerified: true
      },
      {
        name: 'Admin Regional',
        email: 'admin@ejemplo.com',
        password: await bcrypt.hash('password123', 10),
        role: 'REGIONAL_ADMIN',
        isVerified: true
      },
      {
        name: 'Super Admin',
        email: 'superadmin@ejemplo.com',
        password: await bcrypt.hash('password123', 10),
        role: 'SUPER_ADMIN',
        isVerified: true
      }
    ];

    // Insertar usuarios
    await User.insertMany(testUsers);
    console.log('Usuarios de prueba creados exitosamente');

    // Listar usuarios creados
    const users = await User.find({}, 'email name role isVerified -_id');
    console.table(users);

    // Desconectar
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear usuarios de prueba:', error);
  }
}

seedUsers();