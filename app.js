const express = require('express')
const cors = require('cors'); // Import cors
const app = express()
const cookieParser = require('cookie-parser')
const port = 3005

//rute data
const EPAdmin = require('./routes/administrator/user')
const EPLoginDash = require('./routes/login')
const EPSiswa = require('./routes/masterData/siswa')
const EPTahunPelajaran = require('./routes/masterData/tahunAjaran')

// Gunakan cors dengan konfigurasi untuk mengizinkan permintaan dari http://localhost:3000
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000'
  }));

 // Middleware untuk mengurai body dalam format JSON
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('dimas ellek')
})

//End point / Url API
app.use('/api', EPLoginDash)
app.use('/admin', EPAdmin)
app.use('/siswa', EPSiswa)
app.use('/masterData', EPTahunPelajaran)

app.listen(port, ()=>{
    console.log(`brtjalan di port http://localhost:${port}`)
})