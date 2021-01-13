const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// Configure cors Middleware
app.use(cors());
app.use(express.json());


// Database
dbConnection();

// Routes
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Server on port', process.env.PORT);
}); 
