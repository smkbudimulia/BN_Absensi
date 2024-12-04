const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB'); // koneksi ke database
const moment = require('moment'); 

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

// Route untuk absensi siswa
router.post('/siswa-abseni', async (req, res) => {
    try {
        const { id_siswa, datang, pulang } = req.body;
        const idAcak = generateRandomString(5);

        // Ambil waktu sekarang
        const currentTime = moment();

        // Format waktu datang
        let datangTime = moment(datang, "HH:mm");
        if (!datang) datangTime = currentTime;

        let keterangan = '';

        // Cek status berdasarkan waktu datang
        if (datangTime.isBetween(moment("06:00", "HH:mm"), moment("07:00", "HH:mm"), null, '[)')) {
            keterangan = 'Datang';
        } else if (datangTime.isBetween(moment("07:01", "HH:mm"), moment("09:00", "HH:mm"), null, '[)')) {
            keterangan = 'Terlambat';
        } else if (datangTime.isAfter(moment("09:00", "HH:mm"))) {
            keterangan = 'Alpa';
        }

        if (pulang) {
            // Format waktu pulang
            const pulangTime = moment(pulang, "HH:mm");
            if (pulangTime.isBetween(moment("14:20", "HH:mm"), moment("16:00", "HH:mm"), null, '[)')) {
                // Update waktu pulang jika valid
                await conn('absensi')
                    .where({ id_siswa })
                    .update({ pulang: pulangTime.format("HH:mm") });

                return res.status(200).json({ message: 'Absen pulang berhasil' });
            } else {
                return res.status(400).json({ message: 'Waktu pulang tidak valid. Harus antara 14:20 - 16:00.' });
            }
        } else {
            // Tambahkan data absensi baru
            const addData = {
                id_absen: idAcak,
                id_siswa,
                datang: datangTime.format("HH:mm"),
                keterangan,
                created_at: currentTime.format("YYYY-MM-DD HH:mm:ss"),
                updated_at: currentTime.format("YYYY-MM-DD HH:mm:ss"),
            };

            await conn('absensi').insert(addData);
            return res.status(201).json({ message: 'Absen berhasil ditambahkan', data: addData });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
});

module.exports = router;
