require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
    if (req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
        next()
    } else {
        res.status(406).json('error')
    }
})

app.use(cors( {
    preflightContinue: true
 }))
const mongoose = require('mongoose')


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://145.24.222.82:8000/recipes');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const recipesRouter = require('./routes/recipes')
app.use('/recipes', recipesRouter)

app.listen(8000, () => console.log('Server started'))