/*
    path:api/upload
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJwt } = require('../middleware/validar-jwt');
const { fileUpload, retornaImage } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJwt, fileUpload);

router.get('/:tipo/:foto', retornaImage);

module.exports = router;