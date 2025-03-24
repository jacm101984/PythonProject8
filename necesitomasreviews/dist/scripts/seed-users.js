"use strict";
// src/scripts/seed-users.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User"); // Ajusta la ruta según tu estructura
// Cargar variables de entorno
dotenv_1.default.config();
async function seedUsers() {
    try {
        // Conectar a MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews');
        console.log('Conectado a MongoDB');
        // Crear usuarios de prueba
        const testUsers = [
            {
                name: 'Usuario Cliente',
                email: 'cliente@ejemplo.com',
                password: await bcrypt_1.default.hash('password123', 10),
                role: 'USER',
                isVerified: true
            },
            {
                name: 'Usuario Promotor',
                email: 'promotor@ejemplo.com',
                password: await bcrypt_1.default.hash('password123', 10),
                role: 'PROMOTER',
                isVerified: true
            },
            {
                name: 'Admin Regional',
                email: 'admin@ejemplo.com',
                password: await bcrypt_1.default.hash('password123', 10),
                role: 'REGIONAL_ADMIN',
                isVerified: true
            },
            {
                name: 'Super Admin',
                email: 'superadmin@ejemplo.com',
                password: await bcrypt_1.default.hash('password123', 10),
                role: 'SUPER_ADMIN',
                isVerified: true
            }
        ];
        // Insertar usuarios
        await User_1.User.insertMany(testUsers);
        console.log('Usuarios de prueba creados exitosamente');
        // Listar usuarios creados
        const users = await User_1.User.find({}, 'email name role isVerified -_id');
        console.table(users);
        // Desconectar
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error al crear usuarios de prueba:', error);
    }
}
seedUsers();
//# sourceMappingURL=seed-users.js.map