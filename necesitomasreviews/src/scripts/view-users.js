const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function listUsers() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews';
    console.log('Intentando conectar a MongoDB en:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');

    // Acceder directamente a la colección
    const db = mongoose.connection.db;
    
    // Listar las colecciones disponibles
    console.log('Colecciones disponibles:');
    const collections = await db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Intentar con diferentes nombres de colección comunes para usuarios
    const collectionNames = ['users', 'Users', 'user', 'User'];
    
    let usersFound = false;
    
    for (const collectionName of collectionNames) {
      if (collections.some(c => c.name === collectionName)) {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        
        console.log(`\nColección ${collectionName} encontrada con ${count} documentos`);
        
        if (count > 0) {
          // Buscar usuarios
          const users = await collection.find({}).toArray();
          
          console.log('\n=== USUARIOS REGISTRADOS ===');
          
          // Mostrar información relevante
          users.forEach((user, index) => {
            console.log(`\n--- Usuario ${index + 1} ---`);
            console.log('Email:', user.email || 'No disponible');
            console.log('Nombre:', user.name || 'No disponible');
            console.log('Rol:', user.role || 'No disponible');
            console.log('Verificado:', user.isVerified ? 'Sí' : 'No');
            console.log('Fecha de creación:', user.createdAt || 'No disponible');
          });
          
          usersFound = true;
        } else {
          console.log('La colección está vacía');
        }
      }
    }
    
    if (!usersFound) {
      console.log('\nNo se encontraron colecciones de usuarios o están vacías');
    }

    // Desconectar
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  } catch (error) {
    console.error('Error al listar usuarios:', error);
  }
}

listUsers();