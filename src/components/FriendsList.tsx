"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const FriendsList = () => {
    const { friends, selectedUser, isLoading, setSelectedUser, onlineUsers, getFriends } = useChatStore();
  useEffect(() => {
    getFriends();
  }, [getFriends]);
    return (
        <div className='border-r border-neutral-800 bg-neutral-900'>
            <div className='flex flex-col h-full'>
                <ScrollArea className='h-[calc(100vh-280px)]'>
                    <div className='space-y-2 p-4'>
                        {isLoading ? (
                            <FriendsListSkeleton />
                        ) : (
                            friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    onClick={() => setSelectedUser(friend)}
                                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                                        rounded-lg cursor-pointer transition-colors
                    ${selectedUser?.id === friend.id ? "bg-neutral-800" : "hover:bg-neutral-800/50"}`}
                                >
                                    <div className='relative'>
                                        <Avatar className='size-8 md:size-12 bg-neutral-800'>
                                            <AvatarImage src={friend.image} />
                                            <AvatarFallback>{friend.name}</AvatarFallback>
                                        </Avatar>
                                        
                                        <div
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-neutral-900
                        ${onlineUsers.has(friend.id) ? "bg-green-500" : "bg-neutral-500"}`}
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0 lg:block hidden'>
                                        <span className='font-medium truncate text-neutral-100'>{friend.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

const FriendsListSkeleton = () => {
    return Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className='flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse'>
            <div className='h-12 w-12 rounded-full bg-neutral-800' />
            <div className='flex-1 lg:block hidden'>
                <div className='h-4 w-24 bg-neutral-800 rounded mb-2' />
                <div className='h-3 w-32 bg-neutral-800 rounded' />
            </div>
        </div>
    ));
};

export default FriendsList