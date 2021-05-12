/*
    Medicos
    path: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const { validarJwt } = require('../middleware/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
} = require('../controllers/medicos');

const router = Router();

router.get('/', validarJwt, getMedicos);

router.post('/', 
    [
        validarJwt,
        check('nombre', 'El nombre del medico es necesario').notEmpty(),
        check('hospital', 'El id del hospital debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico);

router.put('/:id', 
    [
        validarJwt,
        check('nombre', 'El nombre del hospital es necesario').notEmpty(),
        check('hospital', 'El id del hospital debe ser valido').isMongoId(),
        validarCampos
    ], 
    actualizarMedico
);

router.delete('/:id', validarJwt, borrarMedico);

router.get('/:id', validarJwt, getMedicoById);

module.exports = router;

