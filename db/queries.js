import prisma from "./prismaClient.js";

async function createUser(email, password){
    await prisma.user.create({
        data: {
            email: email,
            password: password,
            folders: {
                create: {
                    name: "Main"
                }
            }
        }
    });
}

async function getUserById(userId){
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        include: {
            folders: true
        }
    });

    return user;
}

async function createFile(name, path, url, type, size, folderId){
    await prisma.file.create({
        data: {
            name: name,
            filePath: path,
            fileUrl: url,
            fileType: type,
            size: size,
            folderId: folderId
        }
    })
}

async function createFolder(foldername, parentId, ownerId){
    await prisma.folder.create({
        data: {
            name: foldername,
            parentId: parentId,
            ownerId: ownerId
        }
    });
}

async function getMainFolder(userId){
    const folder = await prisma.folder.findFirst({
        where: {
            ownerId: userId,
            parentId: null
        },
        include: {
            files: true,
            subfolders: true
        }
    });
    console.dir(folder);
    return folder;
}

async function getFolderById(folderId, ownerId){
    const folder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            ownerId: ownerId
        },
        include: {
            files: true,
            subfolders: true
        }
    })

    return folder;
}

async function getAllUserFolders(ownerId){
    const folders = await prisma.folder.findMany({
        where: {
            ownerId: ownerId
        }
    });

    return folders;
}

async function deleteFolderById(folderId){
    await prisma.folder.delete({
        where: {
            id: folderId
        }
    });
}

async function deleteFile(fileId){
    await prisma.file.delete({
        where: {
            id: fileId
        }
    });
}

async function deleteAllFilesByFolderId(folderId){
    await prisma.file.deleteMany({
        where: {
            folderId: folderId
        }
    });
}

async function updateFolderName(newName, folderId, ownerId){
    await prisma.folder.update({
        where: {
            id: folderId,
            ownerId: ownerId
        },
        data: {
            name: newName
        }
    });
}

async function updateFolderLocation(newParentId, folderId, ownerId){
    await prisma.folder.update({
        where: {
            id: folderId,
            ownerId: ownerId
        },
        data: {
            parentId: newParentId
        }
    });
}

async function updateFileName(fileId, newName){
    await prisma.file.update({
        where: {
            id: fileId
        },
        data: {
            name: newName
        }
    });
}

async function updateFileLocation(fileId, newFolderId){
    await prisma.file.update({
        where: {
            id: fileId
        },
        data: {
            folderId: newFolderId
        }
    })
}

async function getFileById(fileId){
    const file = await prisma.file.findFirst({
        where: {
            id: fileId
        },
    });

    return file;
}

const db = {
    createUser,
    getUserById, 
    createFile,
    getMainFolder,
    deleteFile,
    createFolder,
    getFolderById,
    deleteAllFilesByFolderId,
    deleteFolderById,
    updateFolderName,
    getAllUserFolders,
    updateFolderLocation,
    updateFileName,
    updateFileLocation,
    getFileById
}

export default db;