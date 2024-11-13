const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const { expressjwt } = require('express-jwt')

app.use(express.json())
app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('Error connecting to DB:', err);
    });

app.get('/', (req, res) => {
    res.send('Hello there')
})

app.use('/api/horses', require('./routes/horseRouter'))
app.use('/api/cows', require('./routes/cowRouter'))
app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/cred', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256']}))
app.use('/api/cred/horses', require('./routes/horseRouterSecure'))
app.use('/api/cred/cows', require('./routes/cowRouterSecure'))

app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "UnauthorizedError"){
      res.status(err.status)
    }
    return res.send({errMsg: err.message})
  })

app.listen(8750, () => {
    console.log('Server is running on port 8750')
})