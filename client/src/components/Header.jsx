import useAuth from "@/hooks/useAuth";
import ButtonLink from "./LinkButton";
import ProfileMenu from "./ProfileMenu";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <header className="shadow-md py-3 px-4 border-b flex justify-between items-center sticky z-10 top-0 w-full bg-background h-16">
      <div>
        <ButtonLink
          variant="link"
          to="/"
          className="flex items-center gap-2 text-foreground group"
        >
          <img
            src="/weblog-logo.svg"
            alt="Blog App logo"
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
          <ThemeToggle variant="minimal" />
        </div>
      ) : (
        <div className="gap-3 flex items-center">
          <ButtonLink
            to="/new"
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
          >
            Create post
          </ButtonLink>
          <ProfileMenu />
        </div>
      )}
    </header>
  );
}
