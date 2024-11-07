const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')

// data jumlah kelas dan siswanya
router.get('/KelasSiswaTotal', async (req, res) => {
    try {
        const data = await conn('siswa')
            .select(
                'siswa.id_kelas',
                'siswa.id_rombel',
                'kelas.kelas', // Nama kelas dari tabel kelas
                'rombel_belajar.nama_rombel' // Nama rombel dari tabel rombel_belajar
            )
            .count('* as total_siswa')
            .leftJoin('kelas', 'siswa.id_kelas', 'kelas.id_kelas')
            .leftJoin('rombel_belajar', 'siswa.id_rombel', 'rombel_belajar.id_rombel')
            .groupBy('siswa.id_kelas', 'siswa.id_rombel', 'kelas.kelas', 'rombel_belajar.nama_rombel');

        const result = data.map(item => ({
            ...item,
            kelas: `${item.kelas} ${item.nama_rombel}` // Menggabungkan nama kelas dan nama rombel
        }));

        if (data && data.length > 0) {
            res.status(200).json({
                Status: 200,
                message: "ok",
                data: result
            });
        } else {
            res.status(200).json({
                Status: 200,
                message: "No data found",
                data: []
            });
        }
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).json({
            Status: 500,
            error: 'Internal Server Error'
        });
    }
});


router.get('/namaSiswaKelas', async (req, res) => {
    try {
        const data = await conn('siswa')
            .select(
                'siswa.id_siswa',
                'siswa.nis',
                'siswa.id_kelas',
                'siswa.id_rombel',
                'siswa.nama_siswa',
                'siswa.nomor_wali',
                'kelas.kelas', // Nama kelas dari tabel kelas
                'rombel_belajar.nama_rombel' // Nama rombel dari tabel rombel_belajar
            )
            .leftJoin('kelas', 'siswa.id_kelas', 'kelas.id_kelas')
            .leftJoin('rombel_belajar', 'siswa.id_rombel', 'rombel_belajar.id_rombel')
            .groupBy(
                'siswa.nis',
                'siswa.id_kelas',
                'siswa.id_rombel',
                'siswa.nama_siswa',
                'siswa.nomor_wali',
                'kelas.kelas',
                'rombel_belajar.nama_rombel'
            );

        const result = data.map(item => ({
            ...item,
            kelas: `${item.kelas} ${item.nama_rombel}` // Menggabungkan nama kelas dan nama rombel
        }));

        if (data && data.length > 0) {
            res.status(200).json({
                Status: 200,
                message: "ok",
                data: result
            });
        } else {
            res.status(200).json({
                Status: 200,
                message: "No data found",
                data: []
            });
        }
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).json({
            Status: 500,
            error: 'Internal Server Error'
        });
    }
});



module.exports = router;