const { response } = require('express');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
    res.json({
        ok: 'true',
        medicos
    }); 
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;   
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    
    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedico = async (req, res = response) => {

    const uid = req.uid;
    const medicoId = req.params.id;
    const hospitalId = req.body.hospital;

    try {

        const medicoDB = await Medico.findById(medicoId);
        
        if (!medicoDB) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id'
            });
        }
        
        const hospitalDB = await Hospital.findById(hospitalId);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado por id'
            });
        }


        const changesMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoChanges = await Medico.findByIdAndUpdate(medicoId, changesMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoChanges
        }); 
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedico = async (req, res = response) => {

    const medicoId = req.params.id;
    
    try {

        const medicoDB = await Medico.findById(medicoId);
      
        if (!medicoDB) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id'
            });
        }
        
        await Medico.findByIdAndDelete(medicoId);

        res.json({
            ok: 'true',
            msg: 'Medico Eliminado'
        });  

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
