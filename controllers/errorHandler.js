import Errors from '../utils/customError.js';

async function errorHandler(err, req, res, next) {
    
    console.log(err);
    console.log('----------');
    console.log(err.message);

    if(req.session){
        req.session.feedback = err.message;
    }

    if(err instanceof Errors.loginError){
        res.status(err.statusCode).redirect('/login');
        return;
    }

    if(err instanceof Errors.customError){
        res.status(err.statusCode).redirect('/');
        return;
    }

    res.status(500).render('serverError', {status: 500, message: err.message});
}

export default errorHandler;
