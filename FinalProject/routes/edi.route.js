import express from 'express'
import rejService from '../services/rej.service.js';

const router = express.Router();

router.get('/', async function (req,res) {
    const list = await rejService.findAll();
    const listt = await rejService.findAlll();
    listt.sort((a, b) => a.ProID - b.ProID);
    res.render('vwRej/list',{
        rej: list,
        products: listt
    });
});

router.get('/add', async function (req,res) {
    res.render('vwRej/add'); 
});

router.post('/add', async function (req,res) {
    const entity = {
      Up: req.body.Up,
      Rej: req.body.Rej,
      ProI: req.body.ProI
    }
    const ret = await rejService.add(entity);
    console.log(ret)
    res.render('vwRej/list');
});

export default router