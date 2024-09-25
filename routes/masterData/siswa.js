const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')


// operasi post: menambah data akun atau administrasi baru
router.post('/add-Siswa', async (req, res) => {
    const { id_siswa, id_admin, nis, nama_siswa, jenis_kelamin, id_tahun_pelajaran, id_kelas, id_rombel, email, pass, foto, barcode, nama_wali, nomor_wali} = req.body;
    // const idAcak = generateRandomString(5);
    
    // Validasi input kosong
    // if (!nama_admin || !alamat || !jenis_kelamin || !no_telp || !email || !username || !pass || !foto || !status) {
    //     return res.status(400).json({ error: 'Data tidak boleh kosong' });
    // }
  
    try {
        // Cek duplikasi id_admin atau email
        const existingAdmin = await conn('siswa')
            .where('id_siswa', id_siswa)
            .orWhere('nis', nis)
            .first();
  
        if (existingAdmin) {
            return res.status(400).json({ error: 'hieee' });
        }
  
        //Hash pass sebelum disimpan(enkripsi)
        // const hashPass = await bcrypt.hash(pass, 11)
  
        // Masukkan data baru
        const addData = {
            id_siswa, id_admin, nis, nama_siswa, jenis_kelamin, id_tahun_pelajaran, id_kelas, id_rombel, email, pass,foto,barcode,nama_wali,nomor_wali
        };
  
        await conn('siswa').insert(addData);
  
        res.json({
            success: true,
            message: 'siswa berhasil ditambahkan',
            data: addData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error 500 - Internal Server Error' });
    }
  });

  //operasi read: melihat semua akun
router.get('/all-Siswa',  (req, res) => {
    conn('siswa')
    .select('*')
    .then((data) => {
     res.json(data)
    })
    .catch((error) => {
     console.log(error)
     res.status(500).json({error: 'error 500'})
    })
     });

  module.exports = router;