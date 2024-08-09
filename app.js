const express = require('express')
const app = express()
const port = 3005

//rute data
const masterAdmin = require('./routes/AbsensiSiswa/dashboar/user')

app.get('/', (req, res)=>{
    res.send('wkwkw expressss')
})

app.use('/dash', masterAdmin)

app.listen(port, ()=>{
    console.log(`brtjalan di port http://localhost:${port}`)
})