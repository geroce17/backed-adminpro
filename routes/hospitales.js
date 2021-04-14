/*
    Ruta: /api/hospitales
*/

// Imports
const { Router } = require('express');
const { check } = require('express-validator');

// Controlador
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales')

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getHospitales);

router.post('/',
    [
        validarJWT,
        check('nombre', 'el nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'el nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarHospital
);

router.delete('/:id',
    [
        validarJWT,
    ],
    borrarHospital
);

router.delete('/:id', borrarHospital);

module.exports = router;