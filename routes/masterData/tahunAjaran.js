const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')


// untuk mengaktifkan verivikasi token ke semua aksi
// router.use(verifyToken);

// Fungsi untuk mengacak karakter untuk ID
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
  
    return randomString;
  }

  // Operasi Post: luntuk menambah data baru
router.post('/new-tahun-ajaran', async (req, res) =>{
    const {id_tahun_pelajaran, id_admin, tahun, aktif} =req.body
    const idAcak = generateRandomString(5);

    //validai input data
    if (!tahun) {
        return res.status(400).json({
            Status: 400,
            error: 'Data tidak boleh kosong' 
        })        
    }

    try {
        // cek duplikasi data
        const existingTahunAjaran = await conn('tahun_ajaran')
        .where('id_tahun_pelajaran', id_tahun_pelajaran)
        .orWhere('tahun', tahun)
        .first()

        if (existingTahunAjaran) {
            return res.status(400).json({ 
                Status: 400,
                error: 'data sudah ada' 
              });
        }
        const addData = {
            id_tahun_pelajaran: idAcak, 
            id_admin, 
            tahun, 
            aktif}
        await conn('tahun_ajaran').insert(addData)

        res.status(201).json({
            Status: 201,
            success: true,
            message: 'OK',
            data: addData
        })

    } catch (error) {
        
        
    }

})

module.exports = router;