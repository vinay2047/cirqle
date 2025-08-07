"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/nextjs";
import { useUploadThing } from "@uploadthing/react/hooks";



import { ImageIcon, Send } from "lucide-react";
import { useRef, useState } from "react";

const MessageInput = () => {
  const { selectedUser, sendMessage } = useChatStore();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("yourEndpointName");

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage.trim()) return;
    sendMessage(selectedUser.id, newMessage.trim(), "");
    setNewMessage("");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUser && user) {
      const response = await startUpload([file]);
      const imageUrl = response?.[0]?.url;
      if (imageUrl) {
        sendMessage(selectedUser.id, newMessage.trim(), imageUrl);
        setNewMessage("");
      }
    }
  };

  return (
    <div className="p-4 mt-auto border-t border-neutral-800 bg-neutral-900">
      <div className="relative w-full">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Input field with padding */}
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="bg-neutral-800 text-neutral-100 border-none pl-10 pr-12 placeholder:text-neutral-400"
        />

        {/* Prefix: Image Upload Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute left-1 top-1/2 -translate-y-1/2"
          onClick={handleImageClick}
        >
          <ImageIcon className="size-4 text-neutral-400" />
        </Button>

        {/* Suffix: Send Button */}
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <Send className="size-4 text-neutral-100" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;