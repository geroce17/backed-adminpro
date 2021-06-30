/*
    Ruta: /api/medicos
*/

// Imports
const { Router } = require('express');
const { check } = require('express-validator');

// Controlador
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos')

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El campo nombre es necesario').not().isEmpty(),
        check('hospital', 'El campo hospital es necesario').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El campo nombre es necesario').not().isEmpty(),
        check('hospital', 'El campo hospital es necesario').isMongoId(),
    ],
    actualizarMedico
);

router.delete('/:id', validarJWT, borrarMedico);

router.get('/:id', validarJWT, getMedicoById);

module.exports = router;