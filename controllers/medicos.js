const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {
    const uid = req.uid;

    try {
        const medico = new Medico({
            usuario: uid,
            ...req.body
        });

        const storedMedico = await medico.save();

        res.json({
            ok: true,
            medico: storedMedico
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Error inesperado"
        })
    }
}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: "actualizarMedico"
    })
}

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: "borrarMedico"
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
};