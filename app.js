const express = require('express')
const cors = require('cors'); // Import cors
const app = express()
const port = 3005

//rute data
const masterAdmin = require('./routes/AbsensiSiswa/dashboar/user')
const LoginDash = require('./routes/AbsensiSiswa/dashboar/login')

// Gunakan cors dengan konfigurasi untuk mengizinkan permintaan dari http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
  }));

 // Middleware untuk mengurai body dalam format JSON
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('wkwkw expressss')
})

app.use('/api', LoginDash)
app.use('/admin', masterAdmin)

app.listen(port, ()=>{
    console.log(`brtjalan di port http://localhost:${port}`)
})