import { Router } from 'express';
import indexController from '../controllers/indexController.js';
import userController from '../controllers/userController.js';
import tryCatch from '../utils/tryCatch.js';
import upload from '../config/multer.js';
import filesController from '../controllers/filesController.js';
const router = Router();

router.get('/', tryCatch(indexController.getIndex));

router.get('/signup', tryCatch(indexController.getSignUp));

router.get('/login', tryCatch(indexController.getLogIn));

router.get('/mystorage', tryCatch(indexController.getMyStorage));

router.post('/signup', userController.postCreateUser);

router.post('/login', tryCatch(userController.postLogUser));

router.get('/logout', tryCatch(userController.getLogOutUser));

// file handler
router.post('/mystorage/uploadfile/:folderId', upload.array('files', 10), tryCatch(filesController.postCreateFile));

router.post('/deleteFile/:fileId', tryCatch(filesController.postDeleteFile));

// folder handler
router.post('/createFolder/:parentId', tryCatch(filesController.postCreateFolder));

export default router;