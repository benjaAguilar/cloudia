import db from "../db/queries.js";
const fileIcons = {
    IMAGE: '/icons/image.svg',
    VIDEO: '/icons/video.svg',
    DOCUMENT: '/icons/doc.svg',
    AUDIO: '/icons/audio.svg',
    OTHER: '/icons/other.svg',
}

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
    const feedback = req.session.feedback;
    delete req.session.feedback;

    res.render('login', {feedback});
}

async function getMyStorage(req, res, next) {
    if(!res.locals.isAuth){
        return res.redirect('/');
    }
    const userId = res.locals.currentUser.id;
    const feedback = req.session.feedback;
    delete req.session.feedback;

    const folder = await db.getMainFolder(userId);
    const allFolders = await db.getAllUserFolders(userId);

    res.render('mystorage', { 
        folderId: folder.id,
        files: folder.files,
        subfolders: folder.subfolders, 
        folderName: folder.name,
        allFolders,
        fileIcons,
        feedback 
    });
}

async function getFolder(req, res, next){
    if(!res.locals.isAuth){
        return res.redirect('/');
    }
    const feedback = req.session.feedback;
    delete req.session.feedback;

    const ownerId = res.locals.currentUser.id;
    const folderId = parseInt(req.params.folderId);

    const folder = await db.getFolderById(folderId, ownerId);
    const allFolders = await db.getAllUserFolders(ownerId);

    res.render('mystorage', { 
        folderId: folder.id,
        files: folder.files,
        subfolders: folder.subfolders, 
        folderName: folder.name,
        allFolders,
        fileIcons,
        feedback  
    });
}

async function getFile(req, res, next){
    if(!res.locals.isAuth){
        return res.redirect('/');
    }

    const ownerId = res.locals.currentUser.id;
    const fileId = parseInt(req.params.fileId);
    let isOwner = false;

    const file = await db.getFileById(fileId);
    const user = await db.getUserById(ownerId);
    const allFolders = await db.getAllUserFolders(ownerId);

    user.folders.forEach(folder => {
     if(folder.id === file.folderId){
         isOwner = true
     }
    });

    if(!isOwner) return res.redirect('/mystorage');

    res.render('file', {
        file,
        fileIcons,
        allFolders
    });
}

const indexController = {
    getIndex,
    getSignUp,
    getLogIn,
    getMyStorage,
    getFolder,
    getFile
};

export default indexController;