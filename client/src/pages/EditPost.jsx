import { useState, lazy, Suspense, useRef } from "react";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { getPlainTextLength, getWordCount } from "@/lib/textUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import PostView from "@/components/PostView";
import {
  MAX_POST_CHARS_COUNT,
  MAX_SUBTITLE_CHARS_COUNT,
  MAX_TITLE_CHARS_COUNT,
  POST_STATUS,
} from "@/constants/postConstants";
import ButtonLink from "@/components/LinkButton";
import {
  validateContent,
  validateSubtitle,
  validateTitle,
} from "@/lib/postHelper";
import { AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";
import UnsavedChangesDialog from "@/components/UnsavedChangesDialog";

const Editor = lazy(() => import("@/components/Editor"));

const FORM_STAGES = { CONTENT: "content", TITLE: "title", PREVIEW: "preview" };

export default function EditPost() {
  const { data: post } = useLoaderData();
  const FIELD_INITIAL_VALUES = {
    TITLE: post.title || "",
    CONTENT: post.content || "",
    SUBTITLE: post.subtitle || "",
  };
  const actionData = useActionData();
  const navigation = useNavigation();

  const [updateType, setUpdateType] = useState(POST_STATUS.PUBLISHED);
  const [title, setTitle] = useState(FIELD_INITIAL_VALUES.TITLE);
  const [subtitle, setSubtitle] = useState(FIELD_INITIAL_VALUES.SUBTITLE);
  const [content, setContent] = useState(FIELD_INITIAL_VALUES.CONTENT);

  const [stats, setStats] = useState(() => ({
    words: getWordCount(FIELD_INITIAL_VALUES.CONTENT),
    characters: getPlainTextLength(FIELD_INITIAL_VALUES.CONTENT),
  }));
  const [manualOverride, setManualOverride] = useState({
    stage: null,
    targetActionData: undefined,
  });
  const [formFieldModified, setFormFieldModified] = useState({
    title: false,
    subtitle: false,
    content: false,
    response: undefined,
  });
  const [clientErrors, setClientErrors] = useState({
    title: [],
    subtitle: [],
    content: [],
  });
  const subtitleRef = useRef(null);
  const addContentBtnRef = useRef(null);
  const postFormRef = useRef(null);
  const statusInputRef = useRef(null);

  const titleDirty =
    formFieldModified.title && title !== FIELD_INITIAL_VALUES.TITLE;
  const subtitleDirty =
    formFieldModified.subtitle && subtitle !== FIELD_INITIAL_VALUES.SUBTITLE;
  const contentDirty =
    formFieldModified.content && content !== FIELD_INITIAL_VALUES.CONTENT;

  const blocker = useUnsavedChangesWarning(
    titleDirty || subtitleDirty || contentDirty
  );

  const isBusy = navigation.state !== "idle";
  const contentCharsOverLimit = stats.characters > MAX_POST_CHARS_COUNT;

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
    const inputNames = ["title", "subtitle", "content"];
    const otherErrors = fieldErrors.filter(
      (error) => !inputNames.includes(error.field)
    );

    return {
      title: fieldErrors.filter((error) => error.field === "title"),
      subtitle: fieldErrors.filter((error) => error.field === "subtitle"),
      content: fieldErrors.filter((error) => error.field === "content"),
      general:
        otherErrors.length > 0
          ? otherErrors.map((e) => e.message).join(". ")
          : actionData.message || null,
    };
  })();

  const calcFormStage = (() => {
    if (serverErrors.title.length > 0 || serverErrors.subtitle.length > 0) {
      return FORM_STAGES.TITLE;
    }

    if (serverErrors.content.length > 0) return FORM_STAGES.CONTENT;

    if (serverErrors.general) return FORM_STAGES.PREVIEW;

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
      : {
          title: false,
          subtitle: false,
          content: false,
        };
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
    const contentErrs = validateContent(content, stats);

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

  function handleSaveAsDraft() {
    statusInputRef.current.value = POST_STATUS.DRAFT;
    setUpdateType(POST_STATUS.DRAFT);
    postFormRef.current.requestSubmit();
  }

  return (
    <>
      <title>Edit Post | Blog App</title>
      <div className="flex flex-col gap-8 flex-1">
        <header className="flex items-center border-b shadow-xl px-4 py-3">
          <div>
            <ButtonLink
              variant="link"
              to="/"
              className="flex items-center gap-2 group text-foreground"
            >
              <img
                src="/weblog-logo-themed.svg"
                alt="Blog App logo"
                className="size-9 transition-transform group-hover:scale-105"
              />
              <span className="font-medium hidden md:inline">BLOG APP</span>
            </ButtonLink>
          </div>
          <h1 className="font-semibold leading-tight text-lg mx-auto">
            Edit post
          </h1>
          <ButtonLink to={`/post/${post.slug}`} variant="secondary">
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
                  Edit content
                </Button>
              </div>
            )}
            {finalFormStage === FORM_STAGES.CONTENT && (
              <div className="flex items-center justify-between">
                <Button onClick={() => changeFormStage(FORM_STAGES.TITLE)}>
                  Edit title
                </Button>
                <Button onClick={handleProceedToPreview}>Preview</Button>
              </div>
            )}
            {finalFormStage === FORM_STAGES.PREVIEW && (
              <div className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-3 ">
                <Button onClick={() => changeFormStage(FORM_STAGES.CONTENT)}>
                  Edit content
                </Button>
                <div className="flex sm:items-center *:flex-1 sm:*:flex-none gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSaveAsDraft}
                    disabled={isBusy}
                  >
                    {isBusy && updateType === POST_STATUS.DRAFT ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      "Save as draft"
                    )}
                  </Button>
                  <Button type="submit" form="post-form" disabled={isBusy}>
                    {isBusy && updateType === POST_STATUS.PUBLISHED ? (
                      <>
                        <Spinner />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </header>
          <Form
            id="post-form"
            method="patch"
            className="flex flex-col flex-1 gap-3 py-4"
            noValidate
            onSubmit={handleFormSubmit}
            ref={postFormRef}
          >
            {errors.general && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}
            {finalFormStage === FORM_STAGES.TITLE && (
              <div className="space-y-4">
                <Field data-invalid={errors.title.length > 0}>
                  <FieldLabel
                    htmlFor={"title"}
                    className="flex items-center justify-between"
                  >
                    <span>Title</span>
                    <span
                      className={`text-xs  font-normal ${title.length > MAX_TITLE_CHARS_COUNT ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {title.length} / {MAX_TITLE_CHARS_COUNT}
                    </span>
                  </FieldLabel>
                  <Input
                    id="title"
                    type={"text"}
                    autoFocus
                    aria-invalid={errors.title.length > 0}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      handleFormFieldChange("title");
                    }}
                    name="title"
                    className={"py-5"}
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
                <Field>
                  <FieldLabel className="flex justify-between">
                    <div>
                      <span>Subtitle </span>
                      <span className="text-muted-foreground font-normal text-xs">
                        {" "}
                        (optional)
                      </span>
                    </div>
                    <span className="text-muted-foreground font-normal text-xs">
                      {" "}
                      {subtitle.length} / {MAX_SUBTITLE_CHARS_COUNT}
                    </span>
                  </FieldLabel>
                  <Textarea
                    value={subtitle}
                    name="subtitle"
                    ref={subtitleRef}
                    rows={2}
                    className={"resize-none"}
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
                      }
                    }}
                  />
                  <FieldError errors={errors.subtitle} />
                </Field>
              </div>
            )}

            {finalFormStage === FORM_STAGES.CONTENT && (
              <Field
                data-invalid={errors.content.length > 0}
                className={"flex gap-2 flex-col"}
              >
                <FieldError errors={errors.content} />
                <Suspense
                  fallback={
                    <div className="space-y-4 w-full py-4">
                      <Skeleton className="h-12 w-full rounded-md" />
                      <Skeleton className="h-87 w-full rounded-md" />
                    </div>
                  }
                >
                  <Editor
                    content={content}
                    onChange={(c) => {
                      setContent(c);
                      handleFormFieldChange("content");
                    }}
                    onStatsChange={setStats}
                  />
                </Suspense>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>{stats.words.toLocaleString()} words</span>

                  <span
                    className={
                      contentCharsOverLimit
                        ? "text-destructive font-medium"
                        : ""
                    }
                  >
                    {stats.characters.toLocaleString()} /{" "}
                    {MAX_POST_CHARS_COUNT.toLocaleString()}
                  </span>
                </div>
              </Field>
            )}

            {finalFormStage === FORM_STAGES.PREVIEW && (
              <div className="space-y-4">
                <PostView title={title} subtitle={subtitle} content={content} />
                <input type="hidden" name="title" value={title} />
                <input type="hidden" name="subtitle" value={subtitle} />
                <input type="hidden" name="content" value={content} />
                <input
                  type="hidden"
                  name="status"
                  ref={statusInputRef}
                  value={POST_STATUS.PUBLISHED}
                />
              </div>
            )}
          </Form>
        </main>
      </div>
      <UnsavedChangesDialog blocker={blocker} />
    </>
  );
}
