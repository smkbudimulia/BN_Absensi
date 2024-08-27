// const jwt = require('jsonwebtoken')


// function auth(req, res, next) {
//     const token = req.header('auth-token')
//     if(!token) return res.status(401).send('Tidak memiliki akses token')
//         try{
//     const verivikasiToken = jwt.verify(token, process.env.TOKEN_PRIVATE)
//     req.user = verivikasiToken
//     next()
// }
// catch (error) {
//     res.status(400).send('Token Tidak diizinkan')
// }
    
// }
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token; // Ambil token dari HTTP-only cookie

    if (!token) return res.sendStatus(401); // Jika tidak ada token, kirim status 401 Unauthorized

    jwt.verify(token, process.env.TOKEN_PRIVATE, (err, user) => {
        if (err) return res.sendStatus(403); // Jika token tidak valid atau kadaluwarsa, kirim status 403 Forbidden

        req.user = user; // Simpan informasi pengguna di request object
        next(); // Lanjutkan ke handler berikutnya
    });
};

// Contoh penggunaan middleware untuk melindungi rute
router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({
        message: 'Ini adalah rute yang terlindungi!',
        user: req.user // Data pengguna yang disimpan dalam token
    });
});


module.exports = auth