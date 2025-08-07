import { getMessages } from './../actions/message.action';
"use client";
import { create } from "zustand";

import { io,Socket } from "socket.io-client";
import {Message, User } from "@/types";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";



const baseUrl =
  process.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://cirqle.vercel.app";

interface ChatStore {
  isLoading:boolean,
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  friends:User[];
  socket:Socket|null;
  isConnected: boolean;
  onlineUsers:Set<string>;
  messages:Message[]
  initializeSocket: (token:string,userId:string) => void;
  disconnectSocket: () => void;
  getFriends:()=>void;
  sendMessage: (
    receiverId: string,
    content: string,
    image: string
  ) => void;
  deleteMessage: (
    messageId: string
  ) => void;
  getMessages: (friendId: string) => void;
}
export const useChatStore = create<ChatStore>((set,get) => ({
  socket: null,
  onlineUsers: new Set(),
  isConnected: false,
  messages:[],
  friends:[],
  isLoading:false,
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  initializeSocket: (token:string,userId:string) => {
    if (get().isConnected) return;
    const socket = io(baseUrl, { autoConnect: false, auth: { token } });
    
    socket.connect();
    socket.emit('user_connected',userId);
    socket.on('users_online', (users: string[]) => {
      set({ onlineUsers: new Set(users) });
    })
   },
   disconnectSocket: () => {
		if (get().isConnected) {
			get().socket?.disconnect();
			set({ isConnected: false });
		}
	},
 sendMessage: async (receiverId:string, content:string, image:string) => {
  set({isLoading:true});
  try {
    const res = await axiosInstance.post("/chat/send", {
    receiverId,
    content,
    image,
  })

  if (res.data.success) {
    set((state:any)=>({messages:[...state.messages,res.data.message]}));
    const socket=get().socket
    if(!socket) return;
    get().socket?.emit('send_message',res.data.message);
  }
  else{
    toast.error(res.data.error);
  }

  } catch (error:any) {
    toast.error(error.message);
  }finally{
    set({isLoading:false});
  }

  
},

  deleteMessage:async(messageId:string)=>{
    set({isLoading:true});
   try {
    const res=await axiosInstance.delete(`/chat/delete/${messageId}`);
    if(res.data.success){
      set((state:any)=>({messages:state.messages.filter((message:Message)=>message.id!==messageId)}));
    }
    else{
      toast.error(res.data.error);
    }
   } catch (error:any) {
     toast.error(error.message);
   }finally{
    set({isLoading:false});
   }
  },
  getFriends:async()=>{
    set({isLoading:true})
    try {
      const res=await axiosInstance.get('/chat/friends')
      set({friends:res.data.friends});
    } catch (error:any) {
      console.log('Error in fetching friends',error); 
      toast.error(error.message); 
    }finally{
      set({isLoading:false})
    }
  },

  getMessages:async(friendId:string)=>{
    set({isLoading:true})
    try {
      const res=await axiosInstance.get(`/chat/messages/${friendId}`)
      if(res.data.success)
      set({messages:res.data.messages});
    } catch (error) {
      console.log('Error in fetching messages',error);  
    }finally{
      set({isLoading:false})
    }
  }
}));
