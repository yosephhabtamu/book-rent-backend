import { prisma } from "../app";


export async function findUserById(id:string){
    const user = await prisma.user.findUnique({
        where:{
            id,
            isActive:true,
        }
    });
    return user;
}

export async function findUserByEmail(email:string){
    const user = await prisma.user.findUnique({
        where:{
            email,
            isActive:true,
        }
    });
    return user;
}