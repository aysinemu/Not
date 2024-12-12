import express from 'express';
import {dirname, format} from 'path'
import {fileURLToPath} from 'url'
import {engine} from 'express-handlebars';
import categoryRouter from './routes/category.route.js'
import productRouter from './routes/product.route.js'
import productUserRouter from './routes/product-user.route.js'
import accountRouter from './routes/account.route.js'
import numeral from 'numeral';
import categoryService from './services/category.service.js';
import hbs_section from'express-handlebars-sections'
import session from 'express-session';
import { isAdmin,isAuth,isSub,isEdit,isWrite } from './middlewares/auth.mdw.js';
import miscRouter from './routes/misc.route.js';
import Handlebars from 'handlebars';

const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

app.engine('hbs', engine({
    extname: 'hbs',
    helpers: {
        format_number(value){
            return numeral(value).format('0,0') + ' VND';
        },
        fillHtmlContent: hbs_section()
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/static',express.static('static'));

app.use(async function(req,res,next){
    const list = await categoryService.findAll();
    res.locals.lcCategories = list;
    next();
});

app.use(async function(req,res,next){
    if(req.session.auth === undefined){
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
});

app.use(express.urlencoded({
    extended: true
}))

Handlebars.registerHelper('eq', function(a, b) {
    return a === b; // So sánh bằng giá trị và kiểu
});

Handlebars.registerHelper("or", function (a, b) {
    return a || b;
  });

// function rootHandler (req, res) {
//     res.send('Hello World!');
// }

// function serverStartedHander(){
//     console.log('Server started on http://localhost:3000');
// }
app.use('/admin/products',isAuth,productRouter);
app.use('/admin/products/editor',isAuth,isEdit,productRouter);
app.use('/products',productUserRouter);
app.use('/admin/categories',isAuth,isAdmin,categoryRouter);
app.use('/account', accountRouter);
app.use('/misc',isAuth, miscRouter);
app.use('/misc/upload',isAuth,miscRouter);
app.use('/misc/editor',isAuth,miscRouter);

app.get('/', function (req, res) {
    console.log(req.session.auth);
    const number = Math.floor(Math.random()*40);
    // res.render('home', {
    //     layout:false,
    //     randomNumber : number
    // });
    res.render('home', {
        randomNumber : number
    });
});

app.listen(3000, function (){console.log('Server started on http://localhost:3000');});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/test',function (req, res) {res.sendFile(__dirname + '/test.html');});

// app.get('/admin/categories', async function(req,res){
//     const list = await categoryService.findAll();
//     res.render('vwCategory/list',{
//         categories: list});
// });

// app.get('/admin/products', async function(req,res){
//     const list = await productService.findAll();
//     res.render('vwProduct/list',{
//         products: list});
// });

// app.get('/admin/categories/add', async function(req,res){
//     res.render('vwCategory/add');
// });

// app.post('/admin/categories/add', async function(req,res){
//     // console.log(req.body);
//     const entity = {
//         CatName: req.body.CatName
//     }
//     const ret = await categoryService.add(entity);
//     console.log(ret)
//     res.render('vwCategory/add');
// })