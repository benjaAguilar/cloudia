import fs from 'node:fs';
import { v2 as cloudinary } from 'cloudinary';
import db from "../db/queries.js";
import cleanNestedFoldersAndFiles from "../utils/cleanSubfoldersAndFiles.js";
import Errors from '../utils/customError.js';
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

async function postUpdateFolderName(req, res, next){
    const ownerId = res.locals.currentUser.id;
    const folderId = parseInt(req.params.folderId);
    const { newName } = req.body;

    await db.updateFolderName(newName, folderId, ownerId);

    res.redirect('/mystorage');
}

async function postUpdateFolderLocation(req, res, next){
    const ownerId = res.locals.currentUser.id;
    const folderId = parseInt(req.params.folderId);
    const newParentId = parseInt(req.body.newParentId);

    await db.updateFolderLocation(newParentId, folderId, ownerId);

    res.redirect('/mystorage');
}

async function postCreateFile(req, res, next){
    const folderId = parseInt(req.params.folderId);

    const cloudinaryUrls = await Promise.all(
        req.files.map(async (file) => {
          let type = 'raw';

          if(file.mimetype.includes('image')) type = 'image';
          if(file.mimetype.includes('video')) type = 'video';

          const result = await cloudinary.uploader.upload(file.path, {resource_type: type});
          console.log(result);

          return {
              url: result.secure_url,
              displayName: result.display_name 
          } 
        })
      );
      
      console.dir(cloudinaryUrls);

    const promises = req.files.map(file => {
        let i = 0;
        let type = 'OTHER';

        if(file.mimetype.includes('image')) type = 'IMAGE';
        if(file.mimetype.includes('video')) type = 'VIDEO';
        if(file.mimetype.includes('audio')) type = 'AUDIO';
        if(documents.includes(file.mimetype)) type = 'DOCUMENT';

        db.createFile(
            file.originalname, 
            file.path, 
            cloudinaryUrls[i].url, 
            cloudinaryUrls[i].displayName,
            type,
            file.size,
            folderId
        );
        i++;
    });

    await Promise.all(promises);

    res.redirect('/mystorage');
}

async function postDeleteFile(req, res, next){
    const fileId = parseInt(req.params.fileId);

    //delete from filesystem
    const delFile = await db.getFileById(fileId);
    fs.unlink(delFile.filePath, (err) => {
        if(err){
            return next(new Errors.customError('Error deleting file on fs', 500));
        }
    });
    
    //delete from db
    await db.deleteFile(fileId);

    // delete from the cloud storage
    await cloudinary.uploader.destroy(delFile.displayName);

    res.redirect('/mystorage');
}

async function postUpdateFileName(req, res, next){
    const fileId = parseInt(req.params.fileId);
    const { newFileName } = req.body;

    await db.updateFileName(fileId, newFileName);

    res.redirect('/mystorage');
}

async function postUpdateFileLocation(req, res, next){
    const fileId = parseInt(req.params.fileId);
    const newFolderId = parseInt(req.body.newFolderId);

    await db.updateFileLocation(fileId, newFolderId);

    res.redirect('/mystorage');
}

const filesController = {
    postCreateFile,
    postDeleteFile,
    postCreateFolder,
    postDeleteFolder,
    postUpdateFolderName,
    postUpdateFolderLocation,
    postUpdateFileName,
    postUpdateFileLocation
}

export default filesController;