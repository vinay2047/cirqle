"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

export const syncUser = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0]?.emailAddress.split("@")[0],
        email: user.emailAddresses[0]?.emailAddress,
        image: user.imageUrl,
      },
    });

    return newUser;
    return newUser;
  } catch (error) {
    console.log("Erro in syncUser", error);
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
};

export const getDbUser = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("User not found");
  return user.id;
};

export const getRandomUsers = async () => {
  
  const userId = await getDbUser();
  if(!userId) return [];
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return users;
  } catch (error) {
    console.log("Error in getting random users", error);
    return [];
  }
};

export const toggleFollow = async (targetUserId: string) => {
  const userId = await getDbUser();
  if (!userId) return;
  try {
     const existingFollow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });
  if (existingFollow) {
    prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });
    
  }
  else {
      prisma.$transaction([
        prisma.follows.create({
          data:{
            followerId:userId,
            followingId:targetUserId
          }
        }),
        prisma.notification.create({
          data:{
            type:"FOLLOW",
            userId:targetUserId,
            creatorId:userId,
          }
        })
      ])
    }

    revalidatePath('/');
     return { success: true };
  } catch (error) {
     console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
 
};
