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
    res.redirect('/admin/products/editor');
});

router.post('/up',async function (req,res) {
    const id = parseInt(req.body.ProID);
    const entity = {
      Price: req.body.Price
  };
    await productService.up(id,entity);
    res.redirect('/admin/products/editor');
});

router.post('/tym',async function (req,res) {
    const id = parseInt(req.body.ProID);
    const entity = {
      Quantity: req.body.Quantity
  };
    await productService.up(id,entity);
});

router.get('/Moi', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const list = await productService.findAll();
    
    const filteredList = list.filter(product => product.Price === 0);
    
    const sortedList = filteredList.sort((a, b) => b.ProID - a.ProID).slice(0, 10);
    
    res.render('vwProduct/Moi', {
        products: sortedList
    });
});

router.get('/NoiBat', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const list = await productService.findAll();
    const topProducts = list.sort((a, b) => b.Quantity - a.Quantity).slice(0, 4);
    
    res.render('vwProduct/NoiBat', {
        products: topProducts
    });
});

router.get('/XemNhieu', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const list = await productService.findAll();
    const topProducts = list.sort((a, b) => b.Quantity - a.Quantity).slice(0, 10);
    
    res.render('vwProduct/XemNhieu', {
        products: topProducts
    });
});

router.get('/Top10', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const list = await productService.findAll();

    const groupedByCatID = list.reduce((acc, product) => {
        if (!acc[product.CatID]) {
            acc[product.CatID] = [];
        }
        acc[product.CatID].push(product);
        return acc;
    }, {});

    const topProductsByCatID = Object.keys(groupedByCatID).map(catID => {
        const productsInCategory = groupedByCatID[catID];
        const topProducts = productsInCategory
            .sort((a, b) => b.Quantity - a.Quantity) 
            .slice(0, 5); 
        return topProducts;
    }).flat(); 

    res.render('vwProduct/Top10', {
        products: topProductsByCatID
    });
});

export default router 