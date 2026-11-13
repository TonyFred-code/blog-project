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
import { useFetcher, useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import ButtonLink from "@/components/LinkButton";
import UnderConstruction from "@/components/UnderConstruction";

export default function ManagePost() {
  const fetcher = useFetcher();
  const { data: post } = useLoaderData();
  const optimisticPublished = fetcher.formData
    ? fetcher.formData.get("published") === "true"
    : post.published;

  return (
    <div className="flex flex-col relative gap-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
