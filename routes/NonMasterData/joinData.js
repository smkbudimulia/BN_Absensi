const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')

// data jumlah kelas dan siswanya
router.get('/KelasSiswaTotal', async(req, res)=>{
 try {
        conn('siswa')
        .select('id_kelas','id_rombel')
        .count('* as total')
        .groupBy('id_kelas','id_rombel')
        .then((data)=>{
            res.status(200).json({
                Status: 200,
                message: "ok",
                data: data
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          Status: 500,
          error: 'Internal Server Error' 
        });        
    }
})

module.exports = router;