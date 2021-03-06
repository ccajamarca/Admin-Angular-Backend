/*
    path:api/todo
*/
const { Router } = require('express');
const { validarJwt } = require('../middleware/validar-jwt');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', validarJwt, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJwt, getDocumentosColeccion);

module.exports = router;