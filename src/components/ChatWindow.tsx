"use client";

import { Button } from "./ui/button";
import { useChatStore } from "@/stores/useChatStore";
import { Message } from "@/types";

export function ChatWindow() {
  const {sendMessage,messages,deleteMessage}=useChatStore()
   const handleClick1 = (messageId: string) => {
    deleteMessage(messageId);
   }
   const handleClick2=()=>{sendMessage("cmdseze4w0000ugr41yt85atf","Hi","https://unsplash.com/photos/young-asian-travel-woman-is-enjoying-with-beautiful-place-in-bangkok-thailand-_Fqoswmdmoo")};
  return (
    <div>

     {messages.map((message:Message)=> (<Button onClick={()=>handleClick1(message.id)} key={message.id}>Delete</Button>))}
     <Button onClick={handleClick2}>Send</Button>
    </div>

    
   
  )
}

export default ChatWindow