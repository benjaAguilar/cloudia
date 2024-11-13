import db from "../db/queries.js";
const documents = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

async function postCreateFile(req, res, next){
    console.log(req.files);
    console.log("MIME:" + req.files[0].mimetype.includes('image'));
    const folderId = parseInt(req.params.folderId);

    const promises = req.files.map(file => {
        let type = 'OTHER';

        if(file.mimetype.includes('image')) type = 'IMAGE';
        if(file.mimetype.includes('video')) type = 'VIDEO';
        if(file.mimetype.includes('audio')) type = 'AUDIO';
        if(documents.includes(file.mimetype)) type = 'DOCUMENT';

        console.log(file.originalname + ' IS ' + type);
        
        db.createFile(file.originalname, file.path, type, file.size, folderId);
    });
    await Promise.all(promises);

    res.redirect('/mystorage');
}

const filesController = {
    postCreateFile
}

export default filesController;