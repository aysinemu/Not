import express from 'express'
import productService from '../services/product.service.js';
import articlesService from '../services/articles.service.js';
import userService from '../services/user.service.js';

const router = express.Router();

router.get('/byCat', async function (req,res) {
    const listt = await articlesService.findAll();
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
    // console.log("Articles: ", listt);

    const list = await productService.findPageByCatId(id, limit, offset);
    res.render('vwProduct/byCat',{
        products: list,
        empty: list.length === 0,
        page_items: page_items,
        catId: id,
        articles: listt
    });
});

router.get('/detail',async function (req,res) {
    const id = parseInt(req.query.id) || 0;
    const product = await productService.findById(id);
    const listt = await articlesService.findAll();
    const listtt = await userService.findAll();
    if(!product){
        return res.redirect('/products');
    }
    res.render('vwProduct/detail', {
        product: product,
        articles: listt,
        users: listtt,
        user: req.session.authUser
    });
});

router.post('/cmt',async function (req,res) {
    const changes = {
        is_premium : req.body.is_premium,
        author : req.body.author,
        content : req.body.content,
    };
    await articlesService.add(changes);
});

router.post('/del',async function (req,res) { 
    const id = parseInt(req.body.ProID);
    await productService.del(id);
    res.redirect('/admin/products/editor');
});

router.post('/up',async function (req,res) {
    const id = parseInt(req.body.ProID);
    const entity = {
      Price: 0
    };
    const changes = {
        abstract : req.body.abstract,
        category_id : id
    };
    await articlesService.add(changes);
    await productService.up(id,entity);
    res.redirect('/admin/products/editor');
});

router.post('/upp',async function (req,res) {
    const id = parseInt(req.body.ProID);
    const entity = {
      Price: 2,
      FullDes: req.body.FullDes,
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
    const listt = await articlesService.findAll();
    const list = await productService.findAll();
    
    const filteredList = list.filter(product => product.Price === 0);
    
    const sortedList = filteredList.sort((a, b) => b.ProID - a.ProID).slice(0, 10);
    
    res.render('vwProduct/Moi', {
        products: sortedList,
        articles: listt
    });
});

router.get('/NoiBat', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const listt = await articlesService.findAll();
    const list = await productService.findAll();
    const topProducts = list.sort((a, b) => b.Quantity - a.Quantity).slice(0, 4);
    
    res.render('vwProduct/NoiBat', {
        products: topProducts,
        articles: listt
    });
});

router.get('/XemNhieu', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const listt = await articlesService.findAll();
    const list = await productService.findAll();
    const topProducts = list.sort((a, b) => b.Quantity - a.Quantity).slice(0, 10);
    
    res.render('vwProduct/XemNhieu', {
        products: topProducts,
        articles: listt
    });
});

router.get('/Top10', async function (req,res) {
    // const list = await productService.findByCatId(id);
    const list = await productService.findAll();
    const listt = await articlesService.findAll();

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
        products: topProductsByCatID,
        articles: listt
    });
});

export default router 