const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const ActualizarImagen = async (tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log("no se encontro medico");
                return false;
            }
            else{
                const pathViejo = `./uploads/medicos/${medico.img}`;
                borrarImagen(pathViejo);
                medico.img = nombreArchivo;
                await medico.save();

                return true;
            }
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log("no se encontro hospital");
                return false;
            }
            else{
                const pathViejo = `./uploads/hospitales/${hospital.img}`;
                borrarImagen(pathViejo);
                hospital.img = nombreArchivo;
                await hospital.save();

                return true;
            }
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log("no se encontro usuario");
                return false;
            }
            else{
                const pathViejo = `./uploads/usuarios/${usuario.img}`;
                borrarImagen(pathViejo);
                usuario.img = nombreArchivo;
                var changes = await usuario.save();

                console.log(changes);

                return true;
            }
            break;
    }

}

const borrarImagen = (path) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }

}

module.exports = { ActualizarImagen };