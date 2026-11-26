import { useCallback } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";

export default function useUnsavedChangesWarning(isDirty = false) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isDirty && currentLocation.pathname !== nextLocation.pathname;
  });

  useBeforeUnload(
    useCallback(
      (e) => {
        if (!isDirty) return;

        e.preventDefault();
        e.returnValue = "";
      },
      [isDirty]
    )
  );

  return blocker;
}
