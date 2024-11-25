import db from "../db/queries.js";
import { v2 as cloudinary } from 'cloudinary';

async function cleanNestedFoldersAndFiles(folderId, ownerId){
    //also get subfolders and files data
    const folder = await db.getFolderById(folderId, ownerId);

    if(folder.files.length > 0){
        const imagesIds = [];
        const videosIds = [];
        const rawIds = [];

        folder.files.forEach(file => {
          if(file.fileType === 'IMAGE') return imagesIds.push(file.displayName);

          if(file.fileType === 'VIDEO' || file.fileType === 'AUDIO') return videosIds.push(file.displayName);

          rawIds.push(file.displayName);
        });

        try {
            if (imagesIds.length > 0) {
              await cloudinary.api.delete_resources(imagesIds, { resource_type: 'image' });
              console.log('Imágenes eliminadas');
            }
          
            if (videosIds.length > 0) {
              await cloudinary.api.delete_resources(videosIds, { resource_type: 'video' });
              console.log('Videos eliminados');
            }
          
            if (rawIds.length > 0) {
              await cloudinary.api.delete_resources(rawIds, { resource_type: 'raw' });
              console.log('Archivos RAW eliminados');
            }
          } catch (error) {
            console.error('Error al eliminar los archivos:', error);
            console.log('Detalles del error:', error.details); 
          }
        
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