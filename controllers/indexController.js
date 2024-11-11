async function getIndex(req, res, next){
    if(res.locals.isAuth){
        return res.redirect('/mystorage');
    }
    
    res.render('index');
}

async function getSignUp(req, res, next){
    if(res.locals.isAuth){
        return res.redirect('/mystorage');
    }

    res.render('signup');
}

async function getLogIn(req, res, next){
    if(res.locals.isAuth){
        return res.redirect('/mystorage');
    }

    res.render('login');
}

async function getMyStorage(req, res, next) {
    if(!res.locals.isAuth){
        return res.redirect('/');
    }

    res.render('mystorage');
}

const indexController = {
    getIndex,
    getSignUp,
    getLogIn,
    getMyStorage
};

export default indexController;