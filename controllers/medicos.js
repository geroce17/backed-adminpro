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

const actualizarMedico = async (req, res = response) => {
    try {
        const idmedico = req.params.id;
        const idusuario = req.uid;

        const registroMedico = await Medico.findById(idmedico);

        if (!registroMedico) {
            res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: idusuario,
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(idmedico, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medicoActualizado
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: false,
            msg: "Error"
        });
    }
}

const borrarMedico = async (req, res = response) => {
    try {
        const idmedico = req.params.id;

        const medicoRegistro = await Medico.findById(idmedico);

        if (!medicoRegistro) {
            res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado'
            });
        }

        await Medico.findByIdAndDelete(idmedico);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: false,
            msg: "Error"
        });
    }
}

const getMedicoById = async (req, res = response) => {
    const idmedico = req.params.id;
    try {

        const medico = await Medico.findById(idmedico)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        })
    }
    catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
};