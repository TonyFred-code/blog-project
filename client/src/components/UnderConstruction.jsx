import { cn } from "@/lib/utils";

function DraftIcon({ className }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-20", className)}
    >
      {/* page with folded corner */}
      <path d="M14 8h22l10 10v38a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" />
      <path d="M36 8v10h10" />

      {/* title line is written, the rest is still a sketch */}
      <path d="M18 30h12" />
      <path d="M18 38h20" strokeDasharray="3 4" />
      <path d="M18 46h14" strokeDasharray="3 4" />

      {/* pencil, filled so it masks the page behind it */}
      <g transform="translate(54 50) rotate(45)" className="fill-background">
        <path d="M-3 -14h6v22h-6z" />
        <path d="M-3 8l3 6 3-6z" />
        <path d="M-3 -9h6" />
      </g>
    </svg>
  );
}

export default function UnderConstruction({
  title = "Under construction",
  description = "This section isn't ready yet. Check back soon.",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center",
        className
      )}
    >
      <DraftIcon className="text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
