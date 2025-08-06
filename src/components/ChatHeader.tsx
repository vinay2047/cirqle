"use client";
import { useChatStore } from "@/stores/useChatStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const ChatHeader = () => {
    const {selectedUser,onlineUsers}=useChatStore()
    if(!selectedUser) return null;
  return (
    <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={selectedUser.image} />
                <AvatarFallback>{selectedUser.name}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-medium">
                    {selectedUser.name}
                </h2>

                <p className='text-sm text-zinc-400'>
						{onlineUsers.has(selectedUser.id) ? "Online" : "Offline"}
				</p>
            </div>
        </div>

    </div>
  )
}

export default ChatHeader