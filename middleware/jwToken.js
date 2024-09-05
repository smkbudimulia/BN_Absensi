const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    // Mengambil token dari header atau cookie
    const token = req.header('auth-token') || req.cookies['auth-token'];
    
    // Jika token tidak ditemukan, kirimkan respon 401
    if (!token) {
        return res.status(401).send('Tidak memiliki akses token');
    }

    try {
        // Verifikasi token dengan secret key
        const verifikasiToken = jwt.verify(token, process.env.TOKEN_PRIVATE);
        
        // Menyimpan informasi user dari token yang terverifikasi ke req.user
        req.user = verifikasiToken;
        
        // Lanjutkan ke middleware berikutnya atau route handler
        next();
    } catch (error) {
        // Jika terjadi kesalahan (token tidak valid), kirimkan respon 400
        res.status(400).send('Token tidak valid atau tidak diizinkan');
    }
}

module.exports = auth;
