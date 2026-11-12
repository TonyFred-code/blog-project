import Header from "@/components/Header";
import ButtonLink from "@/components/LinkButton";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

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
