const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, imageFileName) => {
    
    let oldPathImage = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            console.log(medico);
            if (!medico) {
                console.log('No es un medico por Id')
                return false;
            }

            oldPathImage = `./uploads/medicos/${ medico.img }`;
            borrarImagen(oldPathImage);

            medico.img = imageFileName;
            await medico.save();
            return true;

        break;
    
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            console.log(hospital);
            if (!hospital) {
                console.log('No es un hospital por Id')
                return false;
            }

            oldPathImage = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(oldPathImage);
            
            hospital.img = imageFileName;
            await hospital.save();
            return true;
        break;
    
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            console.log(usuario);
            if (!usuario) {
                console.log('No existe un usuario por Id')
                return false;
            }

            oldPathImage = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(oldPathImage);
            
            usuario.img = imageFileName;
            await usuario.save();
            return true;
        break;
                
    }

}

module.exports = {
    actualizarImagen
}