const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verfiy');


const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        
        // check email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // check password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }

        // generate token
        const token = await generateJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            token
        })    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        })
    }
}

const googleSignIn = async (req, res=response) => {

    const googleToken = req.body.token

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // verify email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // user exists
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Save user db
        await usuario.save();

        const token = await generateJWT( usuario.id );
        
        res.json({
            ok: true,
            token
        });    

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }    
}

const renewToken = async (req, res=response) => {

    const uid = req.uid;

    const token = await generateJWT( uid );

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });

}


module.exports = {
    login,
    googleSignIn,
    renewToken
}