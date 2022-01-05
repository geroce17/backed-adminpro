const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');

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

// Directorio publico
app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));

app.use('/api/login', require('./routes/auth'));

app.use('/api/hospitales', require('./routes/hospitales'));

app.use('/api/medicos', require('./routes/medicos'));

app.use('/api/todo', require('./routes/busquedas'));

app.use('/api/uploads', require('./routes/uploads'));

// default
app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en el puerto " + process.env.PORT);
});