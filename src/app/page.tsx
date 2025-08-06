
import { getPosts } from "@/actions/post.action";
import { getDbUser } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import ModeToggle from "@/components/ModeToggle";
import PostCard from "@/components/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const authUser=await currentUser()
  const posts=await getPosts()
    const dbUserId = await getDbUser();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 ">
      <div className="lg:col-span-6">
        {authUser?(<CreatePost />):null}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} dbUserId={dbUserId} />
              ))}

            </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestedUsers />
      </div>
      
    </div>
  );
}

