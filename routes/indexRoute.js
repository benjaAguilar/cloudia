import { Router } from 'express';
import indexController from '../controllers/indexController.js';
const router = Router();

router.get('/', indexController.getIndex);

router.get('/signup', indexController.getSignUp);

router.get('/login', indexController.getLogIn);

export default router;