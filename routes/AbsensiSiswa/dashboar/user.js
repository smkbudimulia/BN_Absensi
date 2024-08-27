const express = require('express');
const router = express.Router();
const conn = require('../../../Database/ConfigDB')// koneksi ke database
const bcrypt = require('bcrypt')
const verifyToken = require('../../../middleware/jwToken')


//middleware untuk mendapatkan variabel umum
// router.use((req, res, next) => {
//   req.id_admin = req.params.id;
//   req.newAdmin = req.body;
//   req.update_admin = req.body;
//   next();
// });

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

// operasi post: menambah data akun atau administrasi baru
router.post('/add-Admin', async (req, res) => {
  const { nama_admin, alamat, jenis_kelamin, no_telp, email, username, pass, foto, status } = req.body;
  const idAcak = generateRandomString(5);
  
  // Validasi input kosong
  if (!nama_admin || !alamat || !jenis_kelamin || !no_telp || !email || !username || !pass || !foto || !status) {
      return res.status(400).json({ error: 'Data tidak boleh kosong' });
  }

  try {
      // Cek duplikasi id_admin atau email
      const existingAdmin = await conn('admin')
          .where('id_admin', idAcak)
          .orWhere('email', email)
          .first();

      if (existingAdmin) {
          return res.status(400).json({ error: 'ID Admin atau Email sudah terdaftar' });
      }

      //Hash pass sebelum disimpan(enkripsi)
      const hashPass = await bcrypt.hash(pass, 11)

      // Masukkan data baru
      const addData = {
          id_admin: idAcak,
          nama_admin,
          alamat,
          jenis_kelamin,
          no_telp,
          email,
          username,
          pass: hashPass,
          foto,
          status
      };

      await conn('admin').insert(addData);

      res.json({
          success: true,
          message: 'Admin berhasil ditambahkan',
          data: addData
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error 500 - Internal Server Error' });
  }
});


//operasi read: melihat semua akun
router.get('/all-Admin', verifyToken, (req, res) => {
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
 

//operasi put/ update: merubah data yang sudah ada di database
router.put('/Edit-admin/:id', (req, res) =>{
  const id_admin = req.params.id
  const update_admin = req.body

  conn('admin')
    .where('id_admin', id_admin )
    .update(update_admin)
    .then(() =>{
      res.json({ ...update_admin})
    })
    .catch((error) =>{
      console.log(error)
      res.status(500).json({error: 'error 500'})
    })
})

//operasi delete: menghapus data by Id
router.delete('/hapus-admin/:id', (req, res)=>{
  const id_admin = req.params.id
  
  conn('admin')
    .where('id_admin', id_admin)
    .del()
    .then(()=>{
      res.json({message: 'Data berhasil dihapus'})
    })
    .catch((error)=>{
      console.log(error)
      res.status(500).json({error:'error 500'})
    })
})


module.exports = router;