import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { format } from "date-fns";
import ButtonLink from "@/components/LinkButton";
import UnderConstruction from "@/components/UnderConstruction";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ManagePost() {
  const navigation = useNavigation();
  const [delPostText, setDelPostText] = useState("");
  const fetcher = useFetcher();
  const { data: post } = useLoaderData();
  const actionData = useActionData();

  const optimisticPublished = fetcher.formData
    ? fetcher.formData.get("published") === "true"
    : post.published;

  const CONFIRMATION_TEXT = `sudo rm post ${post.slug.split("-").at(-1)}`;
  const delPostIsConfirmed = delPostText === CONFIRMATION_TEXT;
  const isDeleting =
    navigation.state === "submitting" && navigation.formMethod === "DELETE";

  useEffect(() => {
    if (!actionData) return;

    if (!actionData.success) {
      if (actionData.method === "DELETE") {
        toast.error("Operation Failed", {
          description:
            actionData.message || "Failed to perform delete operation.",
        });
      } else {
        const storedToast = sessionStorage.getItem(
          "flash_manage_post_error_toast"
        );

        if (storedToast) {
          const { title, description } = JSON.parse(storedToast);

          toast.error(title, {
            description,
          });

          sessionStorage.removeItem("flash_manage_post_error_toast");
        }
      }
    }
  }, [actionData]);

  return (
    <div className="flex flex-col relative gap-4 flex-1">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto p-3 w-full flex flex-col gap-4">
        <header className="flex justify-between">
          <h1 className="text-2xl leading-tight font-bold">Manage Post</h1>
          <ButtonLink
            variant="secondary"
            className="flex items-center"
            to={`/post/${post.slug}`}
          >
            <span>Open post </span>
          </ButtonLink>
        </header>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full" variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className={"text-secondary-foreground"}>
                  Overview
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className={"space-y-3"}>
                <dl>
                  <dt>Title:</dt>
                  <dd>
                    <ButtonLink
                      variant="link"
                      className={"text-foreground hover:text-primary"}
                    >
                      {post.title}
                    </ButtonLink>
                  </dd>
                </dl>
                <Separator />
                <dl>
                  <dt>Subtitle:</dt>
                  <dd className="text-muted-foreground">
                    {post.subtitle || (
                      <span className="italic">
                        Post does not have a subtitle
                      </span>
                    )}
                  </dd>
                </dl>
                <Separator />
                <div className="w-full max-w-sm space-y-2 my-3">
                  <dl className="flex items-center justify-between">
                    <dt>Created at:</dt>
                    <dd className="text-muted-foreground">
                      {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
                    </dd>
                  </dl>
                  <Separator />
                  <dl className="flex items-center justify-between">
                    <dt>Last updated at:</dt>
                    <dd className="text-muted-foreground">
                      {format(new Date(post.updatedAt), "yyyy-MM-dd HH:mm")}
                    </dd>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <UnderConstruction />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <UnderConstruction />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground"}>
                  Manage your account preferences and options. Customize your
                  experience to fit your needs.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className={"space-y-4"}>
                <section className="space-y-3 p-3">
                  <div>
                    <h3 className="font-medium text-xl">Edit Post</h3>
                    <p className="text-secondary-foreground">
                      Make changes to your post
                    </p>
                  </div>
                  <ButtonLink to={`/post/${post.slug}/edit`}>
                    Edit Post
                  </ButtonLink>
                </section>
                <Separator />
                <section className="space-y-3 p-3">
                  <div>
                    <h3 className="font-medium text-xl">
                      {optimisticPublished ? "Unpublish post" : "Publish post"}
                    </h3>
                    <p className="text-secondary-foreground">
                      Configure publish status of your post
                    </p>
                  </div>
                  <UnderConstruction />
                </section>
                <Separator />
                <section className="space-y-3 p-3">
                  <header>
                    <h3 className="font-medium text-xl">Delete Post</h3>
                    <p className="text-secondary-foreground">
                      Permanently remove your post
                    </p>
                  </header>
                  <p className="bg-destructive/5 p-3 rounded-md">
                    <strong>Warning</strong>: Deleting your post is an
                    irrevocable action. Consider unpublishing your post instead.
                  </p>
                  <AlertDialog
                    onOpenChange={(open) => !open && setDelPostText("")}
                  >
                    <AlertDialogTrigger
                      render={<Button variant="destructive" />}
                    >
                      Delete post
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this post from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Form
                        id="delete_post_form"
                        method="delete"
                        action={`/post/${post.slug}/manage`}
                      >
                        <p>
                          To confirm, type <br />
                          <code className="rounded font-semibold font-mono text-sm text-destructive select-none">
                            {CONFIRMATION_TEXT}
                          </code>
                        </p>
                        <Field className="py-3">
                          <Input
                            type="text"
                            value={delPostText}
                            onChange={(e) => setDelPostText(e.target.value)}
                          />
                        </Field>
                      </Form>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          type="submit"
                          form="delete_post_form"
                          variant="destructive"
                          disabled={!delPostIsConfirmed || isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Spinner />
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <span>Delete</span>
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
