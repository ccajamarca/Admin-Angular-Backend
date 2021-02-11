/*
    Hospitales
    path: /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const { validarJwt } = require('../middleware/validar-jwt');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales');

const router = Router();

router.get('/', getHospitales);

router.post('/', 
    [ 
        validarJwt,
        check('nombre', 'El nombre del hospital es necesario').notEmpty(),
        validarCampos
    ], 
    crearHospital);

router.put('/:id', 
    [], 
    actualizarHospital);

router.delete('/:id', borrarHospital);

module.exports = router;

