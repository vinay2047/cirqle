import { getDbUser } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
    try {
      const user = await getDbUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" });
    const sender = await prisma.message.findUnique({
      where: { id: params.messageId },
      select: { senderId: true },
    });
    if (!sender)
      NextResponse.json({ success: false, error: "Message not found" });
    if (sender?.senderId !== user) return NextResponse.json({ success: false, error: "Unauthorized" });
    await prisma.message.delete({
      where: { id: params.messageId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Failed to delete message", error);
    return NextResponse.json({ success: false, error: "Failed to delete message" });
  }
}
