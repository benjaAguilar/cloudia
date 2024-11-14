import db from "../db/queries.js";

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
    const userId = res.locals.currentUser.id;

    const folder = await db.getMainFolder(userId);
    const allFolders = await db.getAllUserFolders(userId);

    res.render('mystorage', { 
        folderId: folder.id,
        files: folder.files,
        subfolders: folder.subfolders, 
        folderName: folder.name,
        allFolders 
    });
}

async function getFolder(req, res, next){
    if(!res.locals.isAuth){
        return res.redirect('/');
    }

    const ownerId = res.locals.currentUser.id;
    const folderId = parseInt(req.params.folderId);

    const folder = await db.getFolderById(folderId, ownerId);
    const allFolders = await db.getAllUserFolders(ownerId);

    res.render('mystorage', { 
        folderId: folder.id,
        files: folder.files,
        subfolders: folder.subfolders, 
        folderName: folder.name,
        allFolders 
    });
}

const indexController = {
    getIndex,
    getSignUp,
    getLogIn,
    getMyStorage,
    getFolder
};

export default indexController;