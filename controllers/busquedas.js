const { response } = require('express');

const getBusqueda = async (req, res = response) => {

    const Usuario = require("../models/usuario");
    const Hospital = require("../models/hospital");
    const Medico = require("../models/medico");

    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');

        const [usuarios, hospitales, medicos] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
            Medico.find({ nombre: regex })
        ])

        if (busqueda) {
            res.json({
                ok: true,
                usuarios,
                hospitales,
                medicos
            })
        }
        else {
            res.json({
                ok: false,
                msg: "No hay busqueda"
            })
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        })
    }

}

const getDocumentoColeccion = async (req, res = response) => {
    const Usuario = require("../models/usuario");
    const Hospital = require("../models/hospital");
    const Medico = require("../models/medico");

    try {
        const busqueda = req.params.busqueda;
        const tabla = req.params.tabla;
        const regex = new RegExp(busqueda, 'i');

        let data = [];

        if (busqueda) {

            switch (tabla) {
                case 'usuarios':
                    data = await Usuario.find({ nombre: regex })
                    break;
                case 'hospitales':
                    data = await Hospital.find({ nombre: regex })
                    .populate('usuario', 'nombre img');
                    break;
                case 'medicos':
                    data = await Medico.find({ nombre: regex })
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img');
                    break;
                default:
                    return res.status(500).json({
                        ok: false,
                        msg: 'la tabla tiene que ser usuarios/medicos/hospitales'
                    });
            }

            res.json({
                ok: true,
                tabla,
                resultados: data
            });
        }
        else {
            res.json({
                ok: false,
                msg: "No hay busqueda"
            })
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        })
    }
}

module.exports = { getBusqueda, getDocumentoColeccion };