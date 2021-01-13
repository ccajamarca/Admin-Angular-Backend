const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt')

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');
    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuarios = async (req, res) => {

    const { email, password } = req.body;

    try {

        const existsEmail = await Usuario.findOne({ email });

        if (existsEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encrypt Password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        // Save User
        await usuario.save();

        const token = await generateJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        })
    }
}

const actualizarUsuario = async (req, res) => {
    
    // TODO: Validar token si es el usuario correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);
   
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese id'
            });
        }

        // Update user
        const { password, google, email, ...campos } = req.body;
        console.log(usuarioDB.email);
        console.log(email);

        if (usuarioDB.email !== email) {

            const existsEmail = await Usuario.findOne({ email });
            if (existsEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email; 
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        })
    }
}

const borrarUsuario = async (req, res) => {
    
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
   
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}