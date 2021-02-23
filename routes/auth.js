/**
 * Path: 'api/login'
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJwt } = require('../middleware/validar-jwt');
const router = Router();


router.post('/', 
    [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').notEmpty(),
        validarCampos
    ],
    login
)   

router.post('/google', 
    [
        check('token', 'El token de google es obligatorio').notEmpty(),
        validarCampos
    ],
    googleSignIn   
)   

router.get('/renew', 
    validarJwt,
    renewToken
) 

module.exports = router;    