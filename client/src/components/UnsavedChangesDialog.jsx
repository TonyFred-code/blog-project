import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";

export default function UnsavedChangesDialog({ blocker }) {
  if (!blocker) return null;

  return (
    <AlertDialog
      open={blocker.state === "blocked"}
      onOpenChange={(isOpen) => {
        if (!isOpen) blocker.reset();
      }}
    >
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full flex size-10 shrink-0 items-center justify-center border border-amber-100 bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-300">
            <TriangleAlertIcon className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-sm font-semibold">
            Unsaved changes
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            You have unsaved changes in this form. If you leave now, your
            progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 items-center gap-4 justify-end">
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <Button onClick={() => blocker.proceed()}>Discard Changes</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
