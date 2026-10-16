import ButtonLink from "@/components/LinkButton";
import useAuth from "@/hooks/useAuth";
import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <div>
      <header className="shadow-xl py-3 px-4 border-b flex justify-between items-center">
        <div>
          <ButtonLink to="/" className="flex items-center gap-2">
            {/* todo: USE A OWN DESIGNED LOGO INSTEAD OF LUCIDE-REACT PENLINE */}
            <PenLine />
            <span className="font-medium">BLOG APP</span>
          </ButtonLink>
        </div>
        {isLoading ? (
          <div className="h-8" />
        ) : !isAuthenticated ? (
          <div className="gap-3 flex items-center">
            <ButtonLink to="/login">Login</ButtonLink>
            <ButtonLink to="/register">Register</ButtonLink>
          </div>
        ) : (
          <div className="gap-3 flex items-center">
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <main className="flex flex-col my-8 px-3">
        <h1>Get started</h1>
        <p>Welcome to my blog</p>
      </main>
    </div>
  );
}
