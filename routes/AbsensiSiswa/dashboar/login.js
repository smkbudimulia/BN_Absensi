const express = require('express');
const router = express.Router();
const conn = require('../../../Database/ConfigDB');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Memeriksa apakah ada data yang dikirim atau tidak
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan Password tidak benar' });
    }

    // Mencocokkan username dan password pada database
    conn.select()
        .from('admin')
        .where('nama_admin', username)
        .andWhere('pass', password)
        .first()
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Username & Password Salah' });
            }

            const payload = {
                username: user.nama_admin,
                status: user.status,
            };

            // Membuat token JWT
            const token = jwt.sign(payload, process.env.TOKEN_PRIVATE, { expiresIn: '1h' }); // Token kedaluwarsa dalam 1 jam
            res.header('auth-token', token);
            const Alldata = {
                id: user.id_admin,
                nama: user.nama_admin,
                username: payload.username,                
               
            };
            res.json(Alldata);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Ada Kesalahan' });
        });
});

module.exports = router;
