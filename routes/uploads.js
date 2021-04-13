/* 

    ruta: /api/uploads

*/

const { Router } = require('express');
const { check } = require('express-validator');
const expressFileUpload = require('express-fileupload');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, getImagen } = require('../controllers/uploads')

const router = Router();

router.use(expressFileUpload());

router.put("/:tipo/:id", validarJWT, fileUpload);
router.get("/:tipo/:img", validarJWT, getImagen);

module.exports = router;