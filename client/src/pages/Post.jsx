import Header from "@/components/Header";
import ButtonLink from "@/components/LinkButton";
import PostView from "@/components/PostView";
import { Avatar } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import UserAvatar from "@/components/UserAvatar";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";

export default function Post() {
  const { user } = useAuth();
  const postData = useLoaderData();
  const post = postData.data;

  const isAuthor = user ? user.id === post.authorId : false;

  useEffect(() => {
    const storedToast = sessionStorage.getItem("flash_post_error_toast");

    if (storedToast) {
      const { title, description } = JSON.parse(storedToast);
      toast.error(title, {
        description,
        dismissible: true,
      });

      sessionStorage.removeItem("flash_post_error_toast");
    }
  }, []);

  return (
    <div className="flex flex-col relative">
      <Header />
      <div className="flex justify-between py-4 mt-3 w-full max-w-lg mx-auto">
        <div className="flex gap-3 items-center">
          <Avatar>
            {/*todo: seed using author email/pen name
             */}
            <UserAvatar seed={post.authorId} />
          </Avatar>
          <hr />
          <span>Pen name</span>
        </div>

        {isAuthor && (
          <ButtonGroup className="flex gap-2 justify-end">
            <ButtonLink variant="secondary" to={`/post/${post.slug}/edit`}>
              Edit
            </ButtonLink>
            <ButtonLink variant="secondary" to={`/post/${post.slug}/manage`}>
              Manage
            </ButtonLink>
          </ButtonGroup>
        )}
      </div>
      <PostView
        title={post.title}
        content={post.content}
        subtitle={post.subtitle}
      />
    </div>
  );
}
