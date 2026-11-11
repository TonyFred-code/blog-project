import ButtonLink from "@/components/LinkButton";
import ProfileMenu from "@/components/ProfileMenu";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function Header() {
  const { isLoading, isAuthenticated } = useAuth();

  return (
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
  );
}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404)
    return (
      <>
        <title>Page not found | Blog App </title>
        <div>
          <Header />
          <main className="max-w-md mx-auto py-20 text-center space-y-4 px-4">
            <h1 className="text-6xl font-extrabold text-muted-foreground">
              404
            </h1>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">
              {error.data?.message ||
                "The requested blog page could not be found."}
            </p>
            <div>
              <ButtonLink
                to="/"
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors"
              >
                Back to Home
              </ButtonLink>
            </div>
          </main>
        </div>
      </>
    );

  return (
    <>
      <title>Error | Blog App</title>
      <div>
        <Header />
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h1 className="text-xl font-bold text-destructive">
            Something went wrong.
          </h1>
          <p className="text-muted-foreground">Please try again later.</p>
          <div>
            <ButtonLink
              to="/"
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors"
            >
              Back to Home
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
