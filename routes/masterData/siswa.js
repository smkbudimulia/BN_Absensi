const express = require('express');
const router = express.Router();
const conn = require('../../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/jwToken')
const multer = require('multer')
const path = require('path')



function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}

// Operasi Post: untuk menambah data baru
router.post('/add-siswa', async (req, res) => {
  const rombelDataArray = req.body;

  // Periksa apakah input adalah array
  if (Array.isArray(rombelDataArray) && rombelDataArray.length > 0) {
      try {
          // Iterasi melalui setiap data dalam array
          for (const rombelData of rombelDataArray) {
              const { id_siswa, id_admin, nis,nama_siswa,jenis_kelamin, id_tahun_pelajaran,id_kelas,id_rombel,nama_wali,nomor_wali} = rombelData;

              // Validasi input data
              if (!id_siswa || !nis || !nama_siswa || !jenis_kelamin ||!nama_wali || !nomor_wali) {
                  return res.status(400).json({
                      Status: 400,
                      error: 'Data tidak boleh kosong',
                  });
              }

              // Cek duplikasi data
              const existingSiswa = await conn('siswa')
                  .where('id_siswa', id_siswa)
                  .orWhere('nis', nis)
                  .first();

              if (existingSiswa) {
                  console.log(`Data dengan NIS ${nis} sudah ada, melewati proses penyimpanan.`);
                  continue; // Jika data sudah ada, lewati iterasi ini dan lanjutkan ke berikutnya
              }

             
              const addData = {
                id_siswa, 
                id_admin,
                nis,
                nama_siswa,
                jenis_kelamin, 
                id_tahun_pelajaran,
                id_kelas,
                id_rombel,
                nama_wali,
                nomor_wali,
              };

              await conn('siswa').insert(addData);
          }

          res.status(201).json({
              Status: 201,
              success: true,
              message: 'Data berhasil ditambahkan',
          });

      } catch (error) {
          console.log(error);
          res.status(500).json({
              Status: 500,
              error: 'Internal Server Error',
          });
      }

  } else {
      // Jika input bukan array (data tunggal)
      const { id_siswa, id_admin, nis,nama_siswa,jenis_kelamin, id_tahun_pelajaran,id_kelas,id_rombel,nama_wali,nomor_wali } = req.body;

      // Validasi input data
      if (!id_siswa || !nis || !nama_siswa || !jenis_kelamin ||!nama_wali || !nomor_wali) {
        return res.status(400).json({
            Status: 400,
            error: 'Data tidak boleh kosong',
        });
    }

      try {
          // Cek duplikasi data
          const existingSiswa = await conn('siswa')
          .where('id_siswa', id_siswa)
          .orWhere('nis', nis)
          .first();

          if (existingSiswa) {
            return res.status(400).json({
                Status: 400,
                error: 'Data sudah ada',
            });
        }

         
        const addData = {
          id_siswa, 
          id_admin,
          nis,
          nama_siswa,
          jenis_kelamin, 
          id_tahun_pelajaran,
          id_kelas,
          id_rombel,
          nama_wali,
          nomor_wali,
        };

          await conn('siswa').insert(addData);

          res.status(201).json({
              Status: 201,
              success: true,
              message: 'Data berhasil ditambahkan',
              data: addData
          });

      } catch (error) {
          console.log(error);
          res.status(500).json({
              Status: 500,
              error: 'Internal Server Error',
          });
      }
  }
});


  //operasi read: melihat semua akun
router.get('/all-Siswa',  (req, res) => {
    conn('siswa')
    .select('*',
        'siswa.id_tahun_pelajaran',
        'siswa.id_kelas',
        'siswa.id_rombel'
    )
    .leftJoin('kelas', 'siswa.id_kelas', 'kelas.id_kelas')
    .leftJoin('tahun_ajaran', 'siswa.id_tahun_pelajaran', 'tahun_ajaran.id_tahun_pelajaran')
    .leftJoin('rombel_belajar', 'siswa.id_rombel', 'rombel_belajar.id_rombel')
    .then((data) => {
        res.status(200).json({
            Status: 200,
            message: "ok",
            data: data
        })
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ 
          Status: 500,
          error: 'Internal Server Error' 
        });
    })
     });

     // Operasi Put/ Update: merubah data yang sudah ada pada database
     router.put('/edit-siswa/:id/:nis', async (req, res) => {
        const id_siswa = req.params.id;
        const nis = req.params.nis;
        const { id_admin, nama_siswa,jenis_kelamin, id_tahun_pelajaran,id_kelas,id_rombel,nama_wali,nomor_wali } = req.body;
    
        // Validasi inputan kosong
        if (!id_siswa || !nis || !nama_siswa || !jenis_kelamin ||!nama_wali || !nomor_wali) {
            return res.status(400).json({
                Status: 400,
                error: 'Data tidak boleh kosong'
            });
        }
    
        try {
            // Cek apakah data dengan ID dan NIS yang dimaksud ada
            const existingSiswa = await conn('siswa')
                .where('id_siswa', id_siswa)
                // .andWhere('nis', nis)
                .first();
    
            if (!existingSiswa) {
                return res.status(404).json({
                    Status: 404,
                    error: 'Tidak ada data'
                });
            }
    
            // Cek apakah ada NIS yang sama di data siswa lain
            const duplicateCheck = await conn('siswa')
                .where('nis', nis)
                .andWhere('id_siswa', '!=', id_siswa) // Make sure it's not the same record being updated
                .first();
    
            if (duplicateCheck) {
                return res.status(400).json({
                    Status: 400,
                    error: 'NIS sudah digunakan oleh siswa lain'
                });
            }
    
            // Update data
            const updateSiswa = {
              id_siswa, 
              id_admin,
              nis,
              nama_siswa,
              jenis_kelamin, 
              id_tahun_pelajaran,
              id_kelas,
              id_rombel,
              nama_wali,
              nomor_wali
            };
    
            await conn('siswa')
                .where('id_siswa', id_siswa)
                .andWhere('nis', nis)
                .update(updateSiswa);
    
            res.status(200).json({
                Status: 200,
                message: 'Data berhasil diperbarui',
                data: updateSiswa
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                Status: 500,
                error: 'Internal Server Error'
            });
        }
    });
    
    //operasi delete: menghapus data by Id
router.delete('/hapus-siswa/:id', async (req, res)=>{
    const id_siswa = req.params.id;

    try {
        //cek apakah Id yang dimaksud ada.!
        const existingSiswa = await conn('siswa')
        .where('id_siswa', id_siswa)
        .first()

        if (!existingSiswa) {
            return res.status(404).json({
                Status: 404,
                error: 'Tidak ada data'
            })            
        }
        // hapus tahun pelajaran berdasarkan id
        await conn('siswa')
        .where('id_siswa', id_siswa)
        .del();

        res.status(200).json({
            Status: 200,
            message: 'Data berhasil dihapus'
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({
      Status: 500,
      error: 'Internal Server Error'
    })        
    }
})

  module.exports = router;