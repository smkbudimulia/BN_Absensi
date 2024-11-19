const express = require('express');
const router = express.Router();
const conn = require('../Database/ConfigDB')// koneksi ke database
// const bcrypt = require('bcrypt')
const verifyToken = require('../middleware/jwToken')


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

  router.post('/setting-sistem', async (req, res) => {
    const { nama_instansi, logo, hari, jam_masuk, jam_pulang, jam_terlambat } = req.body;
    const idAcak = generateRandomString(5);
  
    try {
      // Check if there's existing data in the `setting` table
      const existingData = await conn('setting').first(); // Fetches the first record if it exists
  
      if (existingData) {
        // If data exists, perform an update
        const updatedData = {
          nama_instansi,
          logo,
          hari:JSON.stringify(hari) ,
          jam_masuk: JSON.stringify(jam_masuk),
          jam_pulang:JSON.stringify(jam_pulang),
          jam_terlambat: JSON.stringify(jam_terlambat)
        };
  
        await conn('setting').update(updatedData).where('id_setting', existingData.id_setting);
  
        res.status(200).json({
          Status: 200,
          success: true,
          message: 'Data updated successfully',
          data: updatedData
        });
      } else {
        // If no data exists, insert a new record
        const addData = {
          id_setting: idAcak,
          nama_instansi,
          logo,
          hari:JSON.stringify(hari) ,
          jam_masuk: JSON.stringify(jam_masuk),
          jam_pulang:JSON.stringify(jam_pulang),
          jam_terlambat: JSON.stringify(jam_terlambat)
        };
  
        await conn('setting').insert(addData);
  
        res.status(201).json({
          Status: 201,
          success: true,
          message: 'Data inserted successfully',
          data: addData
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        Status: 500,
        error: 'Internal Server Error'
      });
    }
  });

  router.get('/all-setting', async (req, res)=>{
    try {
      
        conn('setting')
        .select('*')
        .then((data)=>{
          res.status(200).json({
            Status: 200,
            Message: "ok",
            data: data,
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