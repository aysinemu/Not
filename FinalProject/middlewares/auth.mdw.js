export function isAuth(req,res,next){
    if(req.session.auth===false){
        req.session.retUrl=req.originalUrl;
        return res.redirect('/account/login');
    }
    next();
}

export function isAdmin(req,res,next){
    if(req.session.authUser.permission!==0){
        return res.render('403');
    }
    next();
}

export function isEdit(req,res,next){
    if(req.session.authUser.permission!==2){
        return res.render('403');
    }
    next();
}

export function isSub(req,res,next){
    if(req.session.authUser.permission!==1){
        return res.render('403');
    }
    next();
}

export function isWrite(req,res,next){
    if(req.session.authUser.permission!==3){
        return res.render('403');
    }
    next();
}