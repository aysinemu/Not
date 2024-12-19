import express from 'express'
import multer from 'multer';
import miscService from '../services/misc.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/editor', function (req,res) {
    res.render('vwMisc/editor');
});

router.post('/editor', function (req,res) {
    console.log(req.body);
    res.render('vwMisc/editor');
});

router.get('/upload', function (req,res) {
    res.render('vwMisc/upload'); 
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './static/imgs'); 
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     }
// });
  
// const upload = multer({ storage });
  
// router.post('/upload', upload.array('fuMain', 5), async function (req, res) {
//     try {
//       const entity = {
//         ProName: req.body.ProName,
//         CatID: req.body.CatID,
//         TinyDes: req.body.TinyDes,
//         FullDes: req.body.FullDes,
//         Price: req.body.Price
//       };
  
//       const ret = await miscService.add(entity);
//       console.log('Database response:', ret);
//       console.log('Uploaded files:', req.files);
  
//       res.render('vwMisc/upload', { message: 'Upload và lưu thành công!' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Có lỗi xảy ra.');
//     }
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    const tempDir = path.join('E:', 'HTML', 'WebProgram', 'FinalProject', 'static', 'imgs', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true }); 
    }
    cb(null, tempDir); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage });

router.post('/upload', upload.array('fuMain', 5), async function (req, res) {
  try {
    const entity = {
      ProName: req.body.ProName,
      CatID: req.body.CatID,
      TinyDes: req.body.TinyDes,
      FullDes: req.body.FullDes,
      Price: req.body.Price
    };

    const ret = await miscService.add(entity); 
    console.log('Database response:', ret); 

    if (!Array.isArray(ret) || ret.length === 0) {
      console.error('ProID không có trong phản hồi:', ret);
      return res.status(400).send('ProID không hợp lệ');
    }

    const proID = ret[0];  
    console.log('ProID:', proID); 

    const proDir = path.join('E:', 'HTML', 'WebProgram', 'FinalProject', 'static', 'imgs', 'sp', proID.toString());
    if (!fs.existsSync(proDir)) {
      fs.mkdirSync(proDir, { recursive: true }); 
    }

    req.files.forEach(file => {
      const tempPath = path.join('E:', 'HTML', 'WebProgram', 'FinalProject', 'static', 'imgs', 'temp', file.filename);
      const targetPath = path.join(proDir, 'main.jpg'); 
      sharp(tempPath)
        .resize(400, 300)  
        .toFile(targetPath, (err, info) => {
          if (err) {
            console.error('Error resizing the image:', err);
            throw err;
          }
          console.log(`File resized and moved to ${targetPath}`, info);
          fs.unlink(tempPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error removing temporary file:', unlinkErr);
            }
          });
        });
    });

    res.render('vwMisc/upload', { message: 'Upload và lưu thành công!' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Có lỗi xảy ra.');
  }
});

router.get('/upload', async function (req,res) {
  const id = parseInt(req.query.id) || 0;
  const product = await miscService.findById(id);
  res.render('vwMisc/upload',{
      product: product
  });
});

export default router
