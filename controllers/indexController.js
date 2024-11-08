async function getIndex(req, res, next){
    res.render('index');
}

async function getSignUp(req, res, next){
    res.render('signup');
}

async function getLogIn(req, res, next){
    res.render('login');
}

const indexController = {
    getIndex,
    getSignUp,
    getLogIn
};

export default indexController;