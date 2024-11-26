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

async function postCreateFile(req, res, next) {
    const folderId = parseInt(req.params.folderId);

    const processedFiles = await Promise.all(
        req.files.map(async (file) => {
            try{
                let type = 'raw';

                if (file.mimetype.includes('image')) type = 'image';
                if (file.mimetype.includes('video') || file.mimetype.includes('audio')) type = 'video';
    
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: type,
                });
    
                //delete from filesystem once is uploaded to cloudinary
                fs.unlink(file.path, (err) => {
                    if(err){
                        return next(new Errors.customError('Error deleting file on fs', 500));
                    }
                });
    
                console.log(result);
    
                return {
                    originalName: file.originalname,
                    localPath: file.path,
                    cloudUrl: result.secure_url,
                    displayName: result.public_id, 
                    type: file.mimetype.includes('image')
                        ? 'IMAGE'
                        : file.mimetype.includes('video')
                        ? 'VIDEO'
                        : file.mimetype.includes('audio')
                        ? 'AUDIO'
                        : documents.includes(file.mimetype)
                        ? 'DOCUMENT'
                        : 'OTHER',
                    size: file.size,
                    error: null,
                };

            }catch(err) {
                console.error(`Error Uploading File ${file.originalName}: ${err.message}`);
                return {
                    originalName: file.originalName,
                    error: `Error Uploading File ${file.originalName}`
                }
            }
        })
    );

    const succesFiles = processedFiles.filter(file => !file.error);
    const failedFiles = processedFiles.filter(file => file.error);

    if (failedFiles.length > 0) {
        console.warn('Algunos archivos no se subieron correctamente:', failedFiles);
    }

    const promises = succesFiles.map(async (file) => {
        try{
            db.createFile(
                file.originalName,
                file.localPath,
                file.cloudUrl,
                file.displayName,
                file.type,
                file.size,
                folderId
            )

        } catch(err){
            let type = 'raw';

            if (file.type === 'IMAGE') type = 'image';
            if (file.type === 'VIDEO' || file.type === 'AUDIO') type = 'video';

            await cloudinary.uploader.destroy(file.displayName, {resource_type: type});
        }
    }
    );

    await Promise.all(promises);

    res.redirect('/mystorage');
}

async function postDeleteFile(req, res, next){
    const fileId = parseInt(req.params.fileId);
    const delFile = await db.getFileById(fileId);
    
    try {
        // delete from the cloud storage
        let type = 'raw';
    
        if (delFile.fileType.includes('IMAGE')) type = 'image';
        if (delFile.fileType.includes('VIDEO') || delFile.fileType.includes('AUDIO')) type = 'video';
    
        await cloudinary.uploader.destroy(delFile.displayName, {resource_type: type});

        //delete from db
        await db.deleteFile(fileId);

    } catch(err) {
        throw new Error(`Error Deleting File ${delFile.name}: ${err.message}`);
    }

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