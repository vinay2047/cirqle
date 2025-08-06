"use client";
export interface Message{
    id:string
    receiverId:string;
    senderId:string;
    content:string;
    image:string;
    createdAt:Date;
    updatedAt:Date;

}

export interface User{
    id:string;
    name?:string;
    username:string;
    bio?:string;
    image?:string;
    location?:string;
    website?:string;
    createdAt:Date;
    updatedAt:Date;
}