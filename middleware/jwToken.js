const jwt = require('jsonwebtoken')


function auth(req, res, next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send('Tidak memiliki akses token')
        try{
    const verivikasiToken = jwt.verify(token, process.env.TOKEN_PRIVATE)
    req.user = verivikasiToken
    next()
}
catch (error) {
    res.status(400).send('Token Tidak diizinkan')
}
    
}

module.exports = auth