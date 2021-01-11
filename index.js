const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// Configure cors Middleware
app.use(cors());


// Database
dbConnection();

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Holsa'
    });
});


app.listen(process.env.PORT, () => {
    console.log('Server on port', process.env.PORT);
}); 
