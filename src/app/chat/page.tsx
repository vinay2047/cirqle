"use client";

import React from 'react'

import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";
import FriendsList from '@/components/FriendsList';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import ChatHeader from '@/components/ChatHeader';
import MessageInput from '@/components/MessageInput';

import { format } from "date-fns";

import { useUser } from '@clerk/nextjs';

const formatTime = (date: Date) => {
  return format(new Date(date), "hh:mm a");
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, getFriends, getMessages } = useChatStore();

  useEffect(() => {
    if (user) getFriends();
  }, [getFriends, user]);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser.id);
  }, [selectedUser, getMessages]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-800 overflow-hidden">
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <FriendsList />

        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?.id ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl
                              : selectedUser.image
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
                          ${message.senderId === user?.id
                            ? "bg-neutral-700 text-neutral-100"
                            : "bg-neutral-800 text-neutral-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-neutral-400 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Cirqle" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-neutral-200 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-neutral-400 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);