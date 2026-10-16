import { buttonVariants } from "./ui/button";
import { cn } from "cn";
import { Link } from "react-router-dom";

export default function ButtonLink({
  to,
  variant = "default",
  size = "default",
  className,
  children,
}) {
  return (
    <Link to={to} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </Link>
  );
}
