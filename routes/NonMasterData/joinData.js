const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')

// data jumlah kelas dan siswanya
router.get('/KelasSiswaTotal', async (req, res) => {
    try {
        const data = await conn('siswa')
            .select('id_kelas', 'id_rombel')
            .count('* as total')
            .groupBy('id_kelas', 'id_rombel');

            const result = data.map(item => ({
                ...item,
                kelas: `${item.id_kelas} ${item.id_rombel}` // Menggabungkan id_kelas dan id_rombel
            }));

        if (data && data.length > 0) {
            // Jika ada data, kirimkan respons dengan hasil
            res.status(200).json({
                Status: 200,
                message: "ok",
                data: result
            });
        } else {
            // Jika tabel kosong atau query tidak mengembalikan data
            res.status(200).json({
                Status: 200,
                message: "No data found",
                data: []
            });
        }
    } catch (error) {
        console.error("Database query failed:", error.message); // Berikan lebih banyak konteks pada log error
        res.status(500).json({
            Status: 500,
            error: 'Internal Server Error'
        });
    }
});

router.get('/namaSiswaKelas', async (req, res) => {
    try {
        const data = await conn('siswa')
            .select('nis','id_kelas', 'id_rombel', 'nama_siswa','nomor_wali')
            // .count('* as total')
            .groupBy('nis','id_kelas', 'id_rombel','nama_siswa','nomor_wali')
            
            const result = data.map(item => ({
                ...item,
                kelas: `${item.id_kelas} ${item.id_rombel}` // Menggabungkan id_kelas dan id_rombel
            }));

        if (data && data.length > 0) {
            // Jika ada data, kirimkan respons dengan hasil
            res.status(200).json({
                Status: 200,
                message: "ok",
                data: result
            });
        } else {
            // Jika tabel kosong atau query tidak mengembalikan data
            res.status(200).json({
                Status: 200,
                message: "No data found",
                data: []
            });
        }
    } catch (error) {
        console.error("Database query failed:", error.message); // Berikan lebih banyak konteks pada log error
        res.status(500).json({
            Status: 500,
            error: 'Internal Server Error'
        });
    }
});


module.exports = router;