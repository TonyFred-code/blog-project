import { AlertCircle, Loader2, PenLine } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Editor from "@/components/Editor";
import ButtonLink from "@/components/LinkButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MAX_POST_CHARS_COUNT,
  MAX_SUBTITLE_CHARS_COUNT,
  MAX_TITLE_CHARS_COUNT,
} from "@/constants/postConstants";
import { getPlainTextLength, getWordCount } from "@/lib/textUtils";
import PostView from "@/components/PostView";
import {
  validateContent,
  validateSubtitle,
  validateTitle,
} from "@/lib/postHelper";

const FORM_STAGES = {
  CONTENT: "content",
  TITLE: "title",
  PREVIEW: "preview",
};

// const defaultContent = `# Welcome to the Markdown Editor!

// This is a sample of the **React Markdown Editor**.

// ## ✨ Features
// - Real-time preview
// - Custom styling support
// - Code highlighting
// - Auto focus at the end of the text

// ## 📦 Sample Code

// \`\`\`javascript
// function hello() {
//   console.log("Hello, world!");
// }
// \`\`\`

// ## 🔗 Links

// Visit [uiwjs/react-md-editor](https://github.com/uiwjs/react-md-editor) for more information.
// `;
// const defaultTitle = "Untitled";
// const defaultSubtitle = "Untitled subtitle";

export default function CreatePost() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [stats, setStats] = useState(() => ({
    words: getWordCount(""),
    characters: getPlainTextLength(""),
  }));
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [formFieldModified, setFormFieldModified] = useState({
    title: false,
    subtitle: false,
    content: false,
    response: null,
  });
  const [manualOverride, setManualOverride] = useState({
    stage: null,
    targetActionData: null,
  });
  const [clientErrors, setClientErrors] = useState({
    title: [],
    subtitle: [],
    content: [],
  });
  const subtitleRef = useRef(null);
  const addContentBtnRef = useRef(null);

  const isSubmitting = navigation.state === "submitting";
  const isOverLimit = stats.characters > MAX_POST_CHARS_COUNT;

  const serverErrors = (() => {
    if (!actionData) {
      return {
        title: [],
        subtitle: [],
        content: [],
        general: null,
      };
    }

    const fieldErrors = Array.isArray(actionData.error) ? actionData.error : [];

    return {
      title: fieldErrors.filter((e) => e.field === "title"),
      subtitle: fieldErrors.filter((e) => e.field === "subtitle"),
      content: fieldErrors.filter((e) => e.field === "content"),
      general: fieldErrors.length === 0 ? actionData.message : null,
    };
  })();

  const calcFormStage = (() => {
    if (
      serverErrors.title.length > 0 ||
      serverErrors.subtitle.length > 0 ||
      serverErrors.general
    )
      return FORM_STAGES.TITLE;

    if (serverErrors.content.length > 0) return FORM_STAGES.CONTENT;

    return null;
  })();

  const activeManualStage =
    manualOverride.targetActionData === actionData
      ? manualOverride.stage
      : null;

  const finalFormStage =
    activeManualStage ?? calcFormStage ?? FORM_STAGES.TITLE;

  const touched =
    formFieldModified.response === actionData
      ? formFieldModified
      : { title: false, subtitle: false, content: false };
  const anyTouched = touched.title || touched.content || touched.subtitle;

  const errors = {
    title: touched.title
      ? []
      : clientErrors.title.length > 0
        ? clientErrors.title
        : serverErrors.title,
    subtitle: touched.subtitle
      ? []
      : clientErrors.subtitle.length > 0
        ? clientErrors.subtitle
        : serverErrors.subtitle,
    content: touched.content
      ? []
      : clientErrors.content.length > 0
        ? clientErrors.content
        : serverErrors.content,
    general: anyTouched ? null : serverErrors.general,
  };

  useEffect(() => {
    if (!actionData) return;

    if (actionData.success && actionData.data.slug) {
      navigate(`/post/${actionData.data.slug}`);
    }
  }, [actionData, navigate]);

  function changeFormStage(newStage) {
    setManualOverride({
      stage: newStage,
      targetActionData: actionData,
    });
  }

  function handleFormFieldChange(fieldName) {
    setFormFieldModified((prev) => {
      const isCurrent = prev.response === actionData;

      if (isCurrent && prev[fieldName]) return prev;

      return {
        title: false,
        content: false,
        subtitle: false,
        ...(isCurrent ? prev : {}),
        response: actionData,
        [fieldName]: true,
      };
    });
  }

  function handleProceedToContent() {
    const titleErrs = validateTitle(title);
    const subtitleErrs = validateSubtitle(subtitle);

    if (titleErrs.length > 0 || subtitleErrs.length > 0) {
      setClientErrors((prev) => ({
        ...prev,
        title: titleErrs,
        subtitle: subtitleErrs,
      }));
      setFormFieldModified((prev) => ({
        ...prev,
        title: titleErrs.length === 0,
        subtitle: subtitleErrs.length === 0,
      }));

      return;
    }

    setClientErrors((prev) => ({
      ...prev,
      title: [],
      subtitle: [],
    }));
    changeFormStage(FORM_STAGES.CONTENT);
  }

  function handleProceedToPreview() {
    const contentErrs = validateContent(value, stats);

    if (contentErrs.length > 0) {
      setClientErrors((prev) => ({ ...prev, content: contentErrs }));
      setFormFieldModified((prev) => ({ ...prev, content: false }));
      return;
    }

    setClientErrors((prev) => ({ ...prev, content: [] }));
    changeFormStage(FORM_STAGES.PREVIEW);
  }

  function handleFormSubmit(e) {
    if (finalFormStage !== FORM_STAGES.PREVIEW) {
      e.preventDefault();
      return;
    }
  }

  return (
    <>
      <title>Create post</title>
      <div className="flex flex-col gap-8 flex-1">
        <header className="shadow-xl py-3 px-4 border-b flex items-center">
          <div>
            <ButtonLink
              variant="link"
              to="/"
              className="flex items-center gap-2 group text-foreground"
            >
              <img
                src="/weblog-logo.svg"
                className="size-9 transition-transform group-hover:scale-105"
              />
              <span className="font-medium hidden md:inline">BLOG APP</span>
            </ButtonLink>
          </div>
          <h1 className="font-semibold leading-tight text-lg mx-auto">
            Create a new post
          </h1>
          <ButtonLink to="/" variant="secondary">
            Cancel
          </ButtonLink>
        </header>
        <main className="flex flex-col flex-1 px-4 gap-4 max-w-5xl mx-auto w-full">
          <header>
            {finalFormStage === FORM_STAGES.TITLE && (
              <div className="flex items-center">
                <Button
                  className={"ml-auto"}
                  ref={addContentBtnRef}
                  onClick={handleProceedToContent}
                >
                  Add content
                </Button>
              </div>
            )}
            {finalFormStage === FORM_STAGES.CONTENT && (
              <div className="flex items-center justify-between">
                <Button onClick={() => changeFormStage(FORM_STAGES.TITLE)}>
                  Edit title
                </Button>
                <Button onClick={handleProceedToPreview} disabled={isOverLimit}>
                  Preview
                </Button>
              </div>
            )}
            {finalFormStage === FORM_STAGES.PREVIEW && (
              <div className="flex items-center justify-between">
                <Button onClick={() => changeFormStage(FORM_STAGES.CONTENT)}>
                  Edit content
                </Button>
                <Button
                  type="submit"
                  form="post-form"
                  disabled={isSubmitting || isOverLimit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            )}
          </header>
          <Form
            id="post-form"
            method="post"
            action="/new"
            noValidate
            onSubmit={handleFormSubmit}
            className="flex-1 flex flex-col py-4 gap-3"
          >
            {errors.general && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}
            {finalFormStage === FORM_STAGES.TITLE && (
              <>
                <Field data-invalid={errors.title.length > 0}>
                  <FieldLabel
                    htmlFor={"title"}
                    className="flex items-center justify-between"
                  >
                    <span>Title</span>
                    <span
                      className={`text-xs ${title.length > MAX_TITLE_CHARS_COUNT ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {title.length} / {MAX_TITLE_CHARS_COUNT}
                    </span>
                  </FieldLabel>
                  <Input
                    className={"py-5"}
                    type="text"
                    placeholder="Post title..."
                    name="title"
                    // maxLength={MAX_TITLE_CHARS_COUNT}
                    id="title"
                    aria-invalid={errors.title.length > 0}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      handleFormFieldChange("title");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const titleErrs = validateTitle(title);

                        if (titleErrs.length > 0) {
                          setClientErrors((prev) => ({
                            ...prev,
                            title: titleErrs,
                          }));
                          setFormFieldModified((prev) => ({
                            ...prev,
                            title: false,
                          }));
                        } else {
                          subtitleRef.current?.focus();
                        }
                      }
                    }}
                  />
                  <FieldError errors={errors.title} />
                </Field>
                <Field data-invalid={errors.subtitle.length > 0}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="subtitle">
                      Subtitle{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <span
                      className={`text-xs ${subtitle.length > MAX_SUBTITLE_CHARS_COUNT ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {subtitle.length} / {MAX_SUBTITLE_CHARS_COUNT}
                    </span>
                  </div>
                  <Textarea
                    id="subtitle"
                    name="subtitle"
                    ref={subtitleRef}
                    value={subtitle}
                    rows={2}
                    // maxLength={MAX_SUBTITLE_CHARS_COUNT}
                    className="resize-none"
                    placeholder="A brief one-sentence hook or summary (optional)..."
                    onChange={(e) => {
                      setSubtitle(e.target.value);
                      handleFormFieldChange("subtitle");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && !e.shiftKey) {
                        e.preventDefault();
                        addContentBtnRef.current?.focus();
                        return;
                      }

                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleProceedToContent();
                        return;
                      }
                    }}
                  />
                  <FieldError errors={errors.subtitle} />
                </Field>
              </>
            )}

            {finalFormStage === FORM_STAGES.CONTENT && (
              <Field
                data-invalid={errors.content.length > 0}
                className="flex gap-2 flex-col"
              >
                <FieldError errors={errors.content} />
                <Suspense
                  fallback={
                    <Card className="w-full max-w-xs">
                      <CardHeader>
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="aspect-video w-full" />
                      </CardContent>
                    </Card>
                  }
                >
                  <Editor
                    content={value}
                    onChange={(v) => {
                      setValue(v);
                      handleFormFieldChange("content");
                    }}
                    onStatsChange={setStats}
                    isInvalid={errors.content.length > 0}
                  />
                </Suspense>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>{stats.words.toLocaleString()} words</span>

                  <span
                    className={
                      isOverLimit ? "text-destructive font-medium" : ""
                    }
                  >
                    {stats.characters.toLocaleString()} /{" "}
                    {MAX_POST_CHARS_COUNT.toLocaleString()}
                  </span>
                </div>
              </Field>
            )}
            {finalFormStage === FORM_STAGES.PREVIEW && (
              <>
                <PostView title={title} subtitle={subtitle} content={value} />
                <input type="hidden" name="content" value={value} />
                <input type="hidden" name="title" value={title} />
                <input type="hidden" name="subtitle" value={subtitle} />
              </>
            )}
          </Form>
        </main>
      </div>
    </>
  );
}
