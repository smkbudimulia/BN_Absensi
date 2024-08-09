const express = require('express');
const router = express.Router();
const conn = require('../../../Database/ConfigDB')// koneksi ke database

//operasi read: melihat semua akun
router.get('/allAkun',(req, res) => {
 conn('admin')
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