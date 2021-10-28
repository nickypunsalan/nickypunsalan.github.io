
const mongoose = require('mongoose')

mongoose
    .connect('secrets.DB_CONN_STRING', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db