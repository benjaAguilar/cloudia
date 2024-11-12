import { Router } from 'express';
import indexController from '../controllers/indexController.js';
import userController from '../controllers/userController.js';
import tryCatch from '../utils/tryCatch.js';
const router = Router();

router.get('/', tryCatch(indexController.getIndex));

router.get('/signup', tryCatch(indexController.getSignUp));

router.get('/login', tryCatch(indexController.getLogIn));

router.get('/mystorage', tryCatch(indexController.getMyStorage));

router.post('/signup', userController.postCreateUser);

router.post('/login', tryCatch(userController.postLogUser));

export default router;