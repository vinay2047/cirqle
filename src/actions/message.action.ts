"use server";

import { prisma } from "@/lib/prisma";
import { getDbUser } from "./user.action"
import { revalidatePath } from "next/cache";

export const sendMessage=async(receiverId:string,content:string,image:string)=>{
    const userId=await getDbUser();
    if(!userId) return null;
    try {
       const message=await prisma.message.create({
            data:{
               senderId:userId,receiverId,content,image
            }
        })
        revalidatePath(`/messages/${receiverId}`);
        return {success:true,message};
    } catch (error) {
        console.log('Failed to send message',error);
        return {success:false,error:"Failed to send message"};
    }
}

export const deleteMessage=async(messageId:string)=>{
    const user=await getDbUser();
    if(!user) return null;
    try {
        const sender=await prisma.message.findUnique({
            where:{id:messageId},
            select:{senderId:true}
        })
        if(!sender) throw new Error('Message not found');
        if(sender.senderId!==user) throw new Error('Unauthorized');
        await prisma.message.delete({
            where:{id:messageId}
        });
        return {success:true};
    } catch (error) {
        console.log('Failed to delete message',error);
        return {success:false,error:"Failed to delete message"};
    }
}

export const getMessages=async(friendId:string)=>{
    const userId=await getDbUser();
    if(!userId) return null;
    try {
        const messages=await prisma.message.findMany({
        where:{
            OR:[{senderId:userId,receiverId:friendId},{senderId:friendId,receiverId:userId}]
        },
        orderBy:{createdAt:"desc"},
        include:{
            sender:true,
            receiver:true
        }
    });
    
        return messages;
    } catch (error) {
        console.log('Error in getting messages',error);
        throw new Error('Failed to fetch messages');
    }

}