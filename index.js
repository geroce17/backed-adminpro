const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Variables de entorno
require('dotenv').config();

// Crear servidor express
const app = express();

// Configurar cors
app.use(cors());

//Conexion base de datos
dbConnection();
console.log(process.env);

app.get('/', (req, res) => {

    res.json(
        {
            obj: true,
            message: "Hola mundo"
        }
    )

});

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en el puerto " + process.env.PORT);
});