import ButtonLink from "@/components/LinkButton";
import PostView from "@/components/PostView";
import ProfileMenu from "@/components/ProfileMenu";
import { Avatar } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";

export default function Post() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const postData = useLoaderData();
  const post = postData.data;

  const isAuthor = user ? user.id === post.authorId : false;

  useEffect(() => {
    const storedToast = sessionStorage.getItem("flash_edit_post_error_toast");

    if (storedToast) {
      const { title, description } = JSON.parse(storedToast);
      toast.error(title, {
        description,
      });
      sessionStorage.removeItem("flash_edit_post_error_toast");
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col relative">
        <header className="shadow-md py-3 px-4 border-b flex justify-between items-center sticky z-10 top-0 w-full bg-background h-16">
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
    </div>
  );
}
