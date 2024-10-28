const express = require('express')
const cors = require('cors'); // Import cors
const app = express()
// const verifyToken = require('../../middleware/jwToken')
const cookieParser = require('cookie-parser')
require('dotenv').config(); // Memuat variabel dari .env
const PORT = process.env.PORT;
//rute data
const EPAdmin = require('./routes/administrator/user')
const EPLoginDash = require('./routes/login')
const EPSiswa = require('./routes/masterData/siswa')
const EPTahunPelajaran = require('./routes/masterData/tahunAjaran')
const EPKelas = require('./routes/masterData/kelas')
const EPRombel = require('./routes/masterData/rombel')
const EPGuru = require('./routes/masterData/guru')
const EPMapel = require('./routes/masterData/mapel')

// Gunakan cors dengan konfigurasi untuk mengizinkan permintaan dari http://localhost:3000

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000'
  }));

 // Middleware untuk mengurai body dalam format JSON
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Express The word')
})

// End point / Url API
// Login
app.use('/api', EPLoginDash)
// Administrator
app.use('/admin', EPAdmin)
// Master Data
app.use('/siswa', EPSiswa)
app.use('/tahun-pelajaran', EPTahunPelajaran)
app.use('/kelas', EPKelas)
app.use('/rombel', EPRombel)
app.use('/guru', EPGuru)
app.use('/mapel', EPMapel)

app.listen(PORT, ()=>{
    console.log(`brtjalan di PORT http://localhost:${PORT}`)
})