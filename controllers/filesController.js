import db from "../db/queries.js";
import cleanNestedFoldersAndFiles from "../utils/cleanSubfoldersAndFiles.js";
const documents = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

async function postCreateFolder(req, res, next){
    const ownerId = res.locals.currentUser.id;
    const parentId = parseInt(req.params.parentId);
    const { foldername } = req.body;

    await db.createFolder(foldername, parentId, ownerId);

    res.redirect('/mystorage');
}

async function postDeleteFolder(req, res, next){
    const ownerId = res.locals.currentUser.id;
    const folderId = parseInt(req.params.folderId);

    await cleanNestedFoldersAndFiles(folderId, ownerId);

    res.redirect('/mystorage');
}

async function postCreateFile(req, res, next){
    const folderId = parseInt(req.params.folderId);

    const promises = req.files.map(file => {
        let type = 'OTHER';

        if(file.mimetype.includes('image')) type = 'IMAGE';
        if(file.mimetype.includes('video')) type = 'VIDEO';
        if(file.mimetype.includes('audio')) type = 'AUDIO';
        if(documents.includes(file.mimetype)) type = 'DOCUMENT';
        
        db.createFile(file.originalname, file.path, type, file.size, folderId);
    });
    await Promise.all(promises);

    res.redirect('/mystorage');
}

async function postDeleteFile(req, res, next){
    const fileId = parseInt(req.params.fileId);

    await db.deleteFile(fileId);
    // CHORE: tambien deberia borrarse de el almacenamiento en cloud!

    res.redirect('/mystorage');
}

const filesController = {
    postCreateFile,
    postDeleteFile,
    postCreateFolder,
    postDeleteFolder
}

export default filesController;