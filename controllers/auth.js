const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
        if (!validPassword) {
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

const googleSignIn = async (req, res = response) => {
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);
        let usuario;
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@',
                img: picture,
                google: true
            });
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        })
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: false,

        })
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    })
}

module.exports = { login, googleSignIn, renewToken };