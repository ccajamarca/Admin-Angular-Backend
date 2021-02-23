const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res=response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
    }
    
    // Valida si existe un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    // Procesar la imagen
    const file = req.files.imagen

    const nombreCortado = file.name.split('.');
    const extensionFile = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionsValids = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionsValids.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension valida'
        });
    }

    // Generar nombre del archivo
    const imageFileName = `${ uuidv4() }.${extensionFile}`;

    // Path to save images
    const path = `./uploads/${ tipo }/${ imageFileName }`;

    // Move lar imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }       
        
        // Update Database
        actualizarImagen(tipo, id, imageFileName);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            imageFileName
        });
    });

}

const retornaImage = (req, res=response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImage = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
    }
        
    const pathNoImage = path.join(__dirname, `../uploads/no-image.png`);
    return res.sendFile(pathNoImage);
}

module.exports = {
    fileUpload,
    retornaImage
}