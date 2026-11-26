import PostFeed from "@/components/PostFeed";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";

export default function Index() {
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

  useEffect(() => {
    const storedToast = sessionStorage.getItem("flash_manage_post_info_toast");

    if (storedToast) {
      const { title, description } = JSON.parse(storedToast);

      toast.info(title, {
        description,
      });

      sessionStorage.removeItem("flash_manage_post_info_toast");
    }
  }, []);

  return (
    <>
      <PageTitle title="Feed" />
      <div className="flex flex-col relative flex-1">
        <Header />
        <main className="grid grid-cols-1 my-8 px-3 max-w-5xl flex-1 w-full mx-auto">
          <PostFeed initialNextCursor={nextCursor} initialPosts={posts} />
        </main>
      </div>
    </>
  );
}
