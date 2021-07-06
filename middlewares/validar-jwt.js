const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario')

const validarJWT = (req, res, next) => {
    // Leer token
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No hay token almacenado"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    }
    catch (err) {
        return res.status(401).json({
            ok: false,
            msg: "Token no valido"
        })
    }
}

const validarADMIN_ROLE = async (req, res, next) => {
    try {
        const uid = req.uid;
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }
        else {
            if (usuarioDB.role === 'ADMIN_ROLE') {
                return res.status(403).json({
                    ok: false,
                    msg: 'Usuario no tiene lo privilegios requeridos'
                })
            }
        }

        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const validarAdminOrUser = async (req, res, next) => {
    try {
        const uid = req.uid;
        const id = req.params.id;

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }
        else {
            if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Usuario no tiene lo privilegios requeridos'
                })
            }
        }

        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = { validarJWT, validarADMIN_ROLE, validarAdminOrUser };