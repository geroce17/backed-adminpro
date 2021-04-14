const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre email img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: true,
            msg: "Error inesperado"
        })
    }

}

const actualizarHospital = async (req, res = response) => {

    try{
        const uid = req.params.id;
        const idUsuario = req.uid;

        const hospitalDB = await Hospital.findById(uid);

        if(!hospitalDB){
            res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: idUsuario
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid, cambiosHospital, {new: true});

        res.json({
            ok: true,
            hospitalActualizado
        });
    }
    catch(e){
        console.log(e);
        res.json({
            ok: false,
            msg: "Error"
        });
    }
    
}

const borrarHospital = async (req, res = response) => {
    try{
        const uid = req.params.id;

        const hospitalDB = await Hospital.findById(uid);

        if(!hospitalDB){
            res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado'
            });
        }

        await Hospital.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });
    }
    catch(e){
        console.log(e);
        res.json({
            ok: false,
            msg: "Error"
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
};