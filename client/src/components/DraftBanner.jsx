import { POST_STATUS } from "@/constants/postConstants";
import { EyeOff, X } from "lucide-react";
import { useState } from "react";

export default function DraftBanner({
  status,
  variant = "full",
  dismissible = true,
  action,
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || status === POST_STATUS.PUBLISHED) {
    return null;
  }

  const isDraft = status === POST_STATUS.DRAFT;

  const title = isDraft ? "Draft Preview" : "Post Unpublished";
  const description = isDraft
    ? "This post is saved as a draft. It is not publicly visible and only you can see this preview."
    : "This post has been unpublished and is hidden from public feeds and non-authors.";

  const containerClasses =
    variant === "card"
      ? "flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200"
      : "w-full border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-950 dark:text-amber-200";

  return (
    <aside role="status" aria-live="polite" className={containerClasses}>
      <div
        className={
          variant === "full"
            ? "mx-auto flex w-full max-w-5xl items-center justify-between gap-3"
            : "flex w-full items-center justify-between gap-3"
        }
      >
        <div className="flex items-center gap-2.5 text-sm">
          <EyeOff className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="leading-snug">
            <strong className="font-semibold">{title}:</strong>{" "}
            <span className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90">
              {description}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action}
          {dismissible && (
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss draft notification"
              className="rounded-md p-1 text-amber-800 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
