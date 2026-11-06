import { createContext, useContext } from "react";

export const RichTextEditorContext = createContext(null);

export const useRichTextEditorContext = () => {
  const context = useContext(RichTextEditorContext);
  if (!context) {
    throw new Error(
      "useRichTextEditorContext must be used within RichTextEditor"
    );
  }
  return context;
};
