const { validationResult } = require('express-validator');
    
const validarCampos = (req, res, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();

}

module.exports = {
    validarCampos
}