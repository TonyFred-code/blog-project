import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Blog App &copy; {CURRENT_YEAR}
        </Link>

        <ThemeToggle />
      </div>
    </footer>
  );
}
