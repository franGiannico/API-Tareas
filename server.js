const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function connectDB() {
    try {
        const client = new MongoClient(uri); // Elimina las opciones obsoletas
        await client.connect();
        console.log('Conectado a MongoDB Atlas');
        return client;
    } catch (err) {
        console.error('Error de conexión a MongoDB Atlas:', err);
        throw err;
    }
}

// Ruta para guardar todas las tareas
app.post('/guardar-tareas', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('tareasDB');
        const tareasCollection = db.collection('tareas');
        await tareasCollection.deleteMany({});
        await tareasCollection.insertMany(req.body);
        res.status(200).send('Tareas guardadas correctamente.');
        client.close();
    } catch (err) {
        console.error('Error al guardar las tareas:', err);
        res.status(500).send('Error al guardar las tareas.');
    }
});

// Ruta para cargar las tareas
app.get('/cargar-tareas', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('tareasDB');
        const tareasCollection = db.collection('tareas');
        const tareas = await tareasCollection.find().toArray();
        res.status(200).json(tareas);
        client.close();
    } catch (err) {
        console.error('Error al cargar las tareas:', err);
        res.status(500).send('Error al cargar las tareas.');
    }
});

// Ruta para limpiar todas las tareas
app.post('/limpiar-tareas', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('tareasDB');
        const tareasCollection = db.collection('tareas');
        await tareasCollection.deleteMany({});
        res.status(200).send('Todas las tareas han sido limpiadas.');
        client.close();
    } catch (err) {
        console.error('Error al limpiar las tareas:', err);
        res.status(500).send('Error al limpiar las tareas.');
    }
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});