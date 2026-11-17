import { cn } from "./ui/utils";

export const ControlsGroup = ({ children, className }) => (
  <div className={cn("rte-controls-group", className)}>{children}</div>
);
