import express from 'express'
import productService from '../services/product.service.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await productService.findAll();

    list.sort((a, b) => a.ProID - b.ProID);

    res.render('vwProduct/list', {
        products: list
    });
});


router.get('/editor', async function (req,res) {
    const list = await productService.findAll();

    list.sort((a, b) => a.ProID - b.ProID);

    res.render('vwProduct/editor', {
        products: list
    });
});

export default router