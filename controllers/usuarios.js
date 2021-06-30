const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    console.log(desde);

    const [usuarios, total] = await Promise.all([
        Usuario.find()
            .skip(desde)
            .limit(10),

        Usuario.countDocuments()
    ]);

    try {
        const uid = req.uid;
        res.json({
            obj: true,
            usuarios,
            uid,
            total
        })
    }
    catch (error) {
        console.error(error);
        res.status(500, json({
            ok: false,
            msg: "Error inesperado"
        }));
    }

}

const crearUsuario = async (req, res) => {

    const _usuario = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email: _usuario.email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(_usuario.password, salt);

        // Guardar usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    }
    catch (error) {
        console.error(error);
        res.status(500, json({
            ok: false,
            msg: "Error inesperado"
        }));
    }

}

// TODO: Validar token y comprobar si es el usuario correcto
const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    console.log(req.body);
    console.log(uid);
    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        // Actualizacion usuario
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email != email) {
            const existeEmail = await Usuario.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        }
        else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'No puedes cambiar tu correo electronico siendo usuario de google'
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    }
    catch (error) {
        console.error(error);
        res.status(500, json({
            ok: false,
            msg: "Error inesperado"
        }));
    }
}

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        return res.status(200).json({
            obj: true,
            msg: "Usuario eliminado"
        });
    }
    catch (error) {
        return res.status(500).json({
            obj: true,
            msg: "Error inesperado"
        })
    }


}

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario };