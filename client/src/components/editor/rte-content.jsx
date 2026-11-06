import { EditorContent } from "@tiptap/react";

import { useRichTextEditorContext } from "./rte-context";
import { cn } from "./ui/utils";

export const Content = ({ children, className }) => {
  const { editor } = useRichTextEditorContext();

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={cn("rte-content w-full", className)}
      />
      {children}
    </div>
  );
};
