const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { ActualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = response) => {

    try {

        const tipo = req.params.tipo;
        const id = req.params.id;

        const tiposValidos = ["hospitales", "usuarios", "medicos"];

        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: "No es medico, usuario u hospital"
            });
        }

        // Validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: "No se encontro ningun archivo adjunto"
            });
        }

        // Procesar la imagen
        const file = req.files.imagen;
        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Validar extension
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: "Ese archivo no es valido"
            });
        }

        // Generar nombre archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        // Path para guardar archivo
        const path = `./uploads/${tipo}/${nombreArchivo}`;

        file.mv(path, (err) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: "error al mover la imagen"
                })
            }

            res.json({
                ok: true,
                nombreArchivo
            });

            ActualizarImagen(tipo, id, nombreArchivo);
        })
        
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: true,
            msg: "Error inesperado"
        });
    }

}

const getImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.img;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }
    else{
        const noImgPath = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(noImgPath);
    }
}


module.exports = { fileUpload, getImagen };