const express = require('express')
const cors = require('cors'); // Import cors
const app = express()
const port = 3005

//rute data
const Admin = require('./routes/administrator/user')
const LoginDash = require('./routes/login')
const  DataSiswa = require('./routes/masterData/siswa')

// Gunakan cors dengan konfigurasi untuk mengizinkan permintaan dari http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
  }));

 // Middleware untuk mengurai body dalam format JSON
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('dimas ellek')
})

//End point / Url API
app.use('/api', LoginDash)
app.use('/admin', Admin)
app.use('/siswa', DataSiswa)

app.listen(port, ()=>{
    console.log(`brtjalan di port http://localhost:${port}`)
})