import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Monitor, MoonIcon, SunIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useId, useSyncExternalStore } from "react";

const OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: Monitor },
];

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

function useSprings() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return { icon: { duration: 0 }, pill: { duration: 0 } };
  }

  return {
    icon: { type: "spring", stiffness: 220, damping: 15 },
    pill: { type: "spring", stiffness: 420, damping: 34 },
  };
}

function MinimalToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { icon: spring } = useSprings();
  const maskId = `moon-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        initial={false}
        animate={{ rotate: isDark ? 40 : 0 }}
        transition={spring}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            r="8"
            fill="black"
            initial={false}
            animate={{ cx: isDark ? 18 : 25, cy: isDark ? 6 : 0 }}
            transition={spring}
          />
        </mask>

        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 8 : 5 }}
          transition={spring}
        />

        <motion.g
          stroke="currentColor"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.3 : 1 }}
          transition={spring}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </Button>
  );
}

function SegmentedToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const { pill: spring } = useSprings();
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "relative inline-flex items-center rounded-lg bg-muted p-0.5",
        className
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            aria-pressed={isActive}
            className="group relative flex size-8 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isActive && (
              <motion.span
                layoutId={`${pillId}-pill`}
                transition={spring}
                aria-hidden="true"
                className="absolute inset-0 rounded-md bg-primary shadow-sm"
              />
            )}
            <Icon
              className={cn(
                "relative size-4 shrink-0 transition-colors duration-150",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ThemeToggle({ variant = "default", className }) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          variant === "minimal" ? "size-8" : "h-9 w-25 rounded-lg bg-muted",
          className
        )}
      />
    );
  }

  return variant === "minimal" ? (
    <MinimalToggle className={className} />
  ) : (
    <SegmentedToggle className={className} />
  );
}
