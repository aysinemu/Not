import express from 'express'
import categoryService from '../services/category.service.js'

const router = express.Router();

router.get('/', async function (req,res) {
    const list = await categoryService.findAll();
    res.render('vwCategory/list',{
        categories: list
    });
});

router.get('/add', async function (req,res) {
    res.render('vwCategory/add'); 
});

router.post('/add', async function (req,res) {
    const entity = {
        CatName: req.body.CatName
    }
    const ret = await categoryService.add(entity);
    console.log(ret)
    res.redirect('/admin/categories');
});

router.get('/edit',async function (req,res) {
    const id = parseInt(req.query.id) || 0;
    const data = await categoryService.findById(id);
    if(!data){
        return res.redirect('/admin/categories');
    }
    res.render('vwCategory/edit', {
        category: data
    });
});

router.post('/del',async function (req,res) { 
    const id = parseInt(req.body.CatID);
    await categoryService.del(id);
    res.redirect('/admin/categories');
});

router.post('/patch',async function (req,res) {
    const id = parseInt(req.body.CatID);
    const changes = {
        CatName: req.body.CatName
    }
    await categoryService.patch(id,changes);
    res.redirect('/admin/categories');
});

export default router
