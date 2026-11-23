import Header from "@/components/Header";
import ButtonLink from "@/components/LinkButton";
import { Button } from "@/components/ui/button";
import { ServerOff, TriangleAlert } from "lucide-react";
import nProgress from "nprogress";
import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const UNREACHABLE_STATUSES = [502, 503, 504];

function getErrorView(error) {
  const status = isRouteErrorResponse(error) ? error.status : error?.status;
  const serverMessage =
    typeof error?.data?.message === "string" ? error.data.message : null;

  if (error?.isNetworkError || UNREACHABLE_STATUSES.includes(status)) {
    return {
      documentTitle: "Server unavailable",
      heading: "Can't reach the server",
      message:
        "The server is offline or unreachable. Check your connection, then try again in a moment.",
      icon: ServerOff,
      canRetry: true,
      showHome: false,
    };
  }

  if (status === 404) {
    return {
      documentTitle: "Page not found",
      heading: "Page not found",
      message: serverMessage || "The requested blog page could not be found.",
      code: "404",
      canRetry: false,
      showHome: true,
    };
  }

  return {
    documentTitle: "Error",
    heading: "Something went wrong",
    message: serverMessage || "Please try again later.",
    icon: TriangleAlert,
    canRetry: true,
    showHome: true,
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const view = getErrorView(error);
  const Icon = view.icon;

  useEffect(() => {
    setTimeout(() => {
      nProgress.done();
    }, 150);
  }, []);

  return (
    <>
      <title>{`${view.documentTitle} | Blog App`}</title>
      <div>
        <Header />
        <main className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
          {view.code && (
            <p
              aria-hidden="true"
              className="text-6xl font-extrabold text-muted-foreground"
            >
              {view.code}
            </p>
          )}
          {Icon && (
            <Icon
              aria-hidden="true"
              className="size-14 mx-auto text-muted-foreground"
              strokeWidth={1.5}
            />
          )}
          <h1 className="text-2xl font-bold">{view.heading}</h1>
          <p className="text-muted-foreground">{view.message}</p>
          <div className="flex justify-center gap-3 pt-2">
            {view.canRetry && (
              <Button onClick={() => window.location.reload()}>
                Try again
              </Button>
            )}
            {view.showHome && (
              <ButtonLink
                to="/"
                variant={view.canRetry ? "secondary" : undefined}
              >
                Back to home
              </ButtonLink>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
