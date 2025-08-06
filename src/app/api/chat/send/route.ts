import { getDbUser } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
   const user=await getDbUser();
   if(!user) return NextResponse.json({success:false,error:"Unauthorized"});
   const {receiverId,content}=await req.json();
   try {
    const message=await prisma.message.create({data:{senderId:user,receiverId,content}});
    return NextResponse.json({success:true,message});
   } catch (error) {
    console.log('Failed to send message',error);
    return NextResponse.json({success:false,error:"Failed to send message"});
   }
}