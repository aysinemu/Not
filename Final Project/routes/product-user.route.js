import express from 'express'
import productService from '../services/product.service.js';

const router = express.Router();

router.get('/byCat', async function (req,res) {
    const id = parseInt(req.query.id) || 0;
    // const list = await productService.findByCatId(id);
    const limit = 4;
    // const offset = parseInt(req.query.offset) || 0;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1)*limit;

    const nRows = await productService.countByCatId(id);
    const nPages = Math.ceil(nRows.total / limit);
    // console.log(nPages);
    const page_items = [];
    for( let i = 1; i <= nPages; i++ ){
        const item = {
            value: i,
            isActive: i === page,
        };
        page_items.push(item);
    }

    const list = await productService.findPageByCatId(id, limit, offset);
    res.render('vwProduct/byCat',{
        products: list,
        empty: list.length === 0,
        page_items: page_items,
        catId: id,
    });
});

router.get('/detail',async function (req,res) {
    const id = parseInt(req.query.id) || 0;
    const product = await productService.findById(id);
    if(!product){
        return res.redirect('/products');
    }
    res.render('vwProduct/detail', {
        product: product
    });
});

router.post('/del',async function (req,res) { 
    const id = parseInt(req.body.ProID);
    await productService.del(id);
    res.redirect('/admin/products');
});

router.post('/up',async function (req,res) {
    const id = parseInt(req.body.ProID);
    const entity = {
      Price: req.body.Price
  };
    await productService.up(id,entity);
    res.redirect('/admin/products/editor');
  });
export default router 