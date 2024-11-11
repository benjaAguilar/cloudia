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

const db = {
    createUser
}

export default db;