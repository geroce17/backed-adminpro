const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');

const login = async (req, res = response) => {
    try {

        const { email, password } = req.body;

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: "Email no encontrado"
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "Contraseña no valida"
            })
        }

        // Generar TOKEN
        const token = await generarJWT(usuarioDB.id);

        return res.json({
            obj: true,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            obj: false,
            msg: "Error inesperado"
        })
    }
}

module.exports = { login };