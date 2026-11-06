import ButtonLink from "@/components/LinkButton";
import useAuth from "@/hooks/useAuth";
import PostFeed from "@/components/PostFeed";
import { useLoaderData } from "react-router-dom";
import ProfileMenu from "@/components/ProfileMenu";
import { useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const postData = useLoaderData();

  const { posts, nextCursor } = postData.data
    ? postData.data
    : { posts: [], nextCursor: null };
  const error = !postData.success ? postData.message : null;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load posts", {
        description: error
          ? error
          : "Something went wrong. Failed to fetch posts.",
        id: "initial_toast_error",
      });
    }
  }, [error]);

  return (
    <>
      <div className="flex flex-col relative">
        <header className="shadow-xl py-3 px-4 border-b flex justify-between items-center sticky z-10 top-0 w-full bg-background h-16">
          <div>
            <ButtonLink
              variant="link"
              to="/"
              className="flex items-center gap-2 text-foreground group"
            >
              <img
                src="/weblog-logo.svg"
                className="size-9 transition-transform group-hover:scale-105"
              />
              <span className="hidden md:inline font-medium">BLOG APP</span>
            </ButtonLink>
          </div>
          {isLoading ? (
            <Skeleton className={"h-8"}></Skeleton>
          ) : !isAuthenticated ? (
            <div className="gap-3 flex items-center">
              <ButtonLink to="/login">Login</ButtonLink>
              <ButtonLink to="/register">Register</ButtonLink>
            </div>
          ) : (
            <div className="gap-3 flex items-center">
              <ButtonLink
                to="/new"
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Create post
              </ButtonLink>
              <ProfileMenu />
            </div>
          )}
        </header>
        <main className="grid grid-cols-1 my-8 px-3 max-w-5xl flex-1 w-full mx-auto">
          <PostFeed initialNextCursor={nextCursor} initialPosts={posts} />
        </main>
      </div>
    </>
  );
}
