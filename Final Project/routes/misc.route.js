import express from 'express'
import multer from 'multer';
import miscService from '../services/misc.service.js';

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/imgs'); 
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
        FullDes: req.body.FullDes
      };
  
      const ret = await miscService.add(entity);
      console.log('Database response:', ret);
      console.log('Uploaded files:', req.files);
  
      res.render('vwMisc/upload', { message: 'Upload và lưu thành công!' });
    } catch (err) {
      console.error(err);
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