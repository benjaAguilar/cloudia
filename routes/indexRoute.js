import { Router } from 'express';
import indexController from '../controllers/indexController.js';
import userController from '../controllers/userController.js';
const router = Router();

router.get('/', indexController.getIndex);

router.get('/signup', indexController.getSignUp);

router.get('/login', indexController.getLogIn);

router.get('/mystorage', indexController.getMyStorage);

router.post('/signup', userController.postCreateUser);

export default router;