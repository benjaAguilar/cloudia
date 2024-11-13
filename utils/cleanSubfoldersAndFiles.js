import db from "../db/queries.js";

async function cleanNestedFoldersAndFiles(folderId, ownerId){
    //also get subfolders and files data
    const folder = await db.getFolderById(folderId, ownerId);

    if(folder.files.length > 0){
        await db.deleteAllFilesByFolderId(folderId);
    }

    if(folder.subfolders.length < 1){
        // delete current folder and return
        await db.deleteFolderById(folderId);
        return;
    }

    const promises = folder.subfolders.map(subfolder => cleanNestedFoldersAndFiles(subfolder.id, ownerId));
    await Promise.all(promises);

    //delete the actual folder that is empty
    const updatedFolder = await db.getFolderById(folderId, ownerId);
    if (updatedFolder.files.length === 0 && updatedFolder.subfolders.length === 0) {
      await db.deleteFolderById(folderId);
    }
}

export default cleanNestedFoldersAndFiles;