import { getPosts } from '@/actions/post.action';
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action';
import { notFound } from 'next/navigation';
import React from 'react'
import ProfilePageClient from './ProfilePageClient';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}
async function ProfilePage({params}:{params:{username:string}}) {
  const user=await getProfileByUsername(params.username)
  if(!user)notFound();
  
  const [likedPosts,posts,isCurrentUserFollowing]=await Promise.all([
    getUserLikedPosts(user.id),
    getUserPosts(user.id),
    isFollowing(user.id)
  ])
  return (
   <ProfilePageClient
   user={user} likedPosts={likedPosts} posts={posts} isFollowing={isCurrentUserFollowing}/>
  )
}

export default ProfilePage