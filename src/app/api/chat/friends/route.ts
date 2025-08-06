import { getDbUser } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const user=await getDbUser();
    if(!user) return NextResponse.json({success:false,error:"Unauthorized"});
    const friends=await prisma.user.findMany({
        where:{followers:{some:{followerId:user}}}
    });
    return NextResponse.json({success:true,friends});
}