const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Variables de entorno
require('dotenv').config();

// Crear servidor express
const app = express();

// Configurar cors
app.use(cors());

//Lectura y parseo de body
app.use(express.json());

//Conexion base de datos
dbConnection();

app.use('/api/usuarios', require('./routes/usuarios'));

app.use('/api/login', require('./routes/auth'));

app.use('/api/hospitales', require('./routes/hospitales'));

app.use('/api/medicos', require('./routes/medicos'));

app.use('/api/todo', require('./routes/busquedas'));

app.use('/api/uploads', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en el puerto " + process.env.PORT);
});