import { getDbUser } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{friendId:string}}){
    const userId=await getDbUser();
        if(!userId) return NextResponse.json({ success: false, error: "Unauthorized" });
        try {
            const messages=await prisma.message.findMany({
            where:{
                OR:[{senderId:userId,receiverId:params.friendId},{senderId:params.friendId,receiverId:userId}]
            },
            orderBy:{createdAt:"desc"},
            include:{
                sender:true,
                receiver:true
            }
        });
        
            return NextResponse.json({ success: true, messages });
        } catch (error) {
            console.log('Error in getting messages',error);
            return NextResponse.json({ success: false, error: "Failed to fetch messages" });
        }
}