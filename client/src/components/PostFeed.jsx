import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router-dom";
import { toast } from "sonner";

export default function PostFeed({ initialPosts, initialNextCursor }) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [consumed, setConsumed] = useState(null);
  const [wantsMore, setWantsMore] = useState(false);

  const failedFetchRef = useRef(null);

  const loadMoreRef = useRef(null);
  const fetcher = useFetcher();
  const { load } = fetcher;

  const isLoading = fetcher.state === "loading";
  const data = fetcher.data?.data;

  // A settled response without a posts array is an error (normalizeApiError).
  const hasFailed = !isLoading && fetcher.data?.success === false;

  // A fetched page the user hasn't committed yet.
  const pending =
    Array.isArray(data?.posts) && data.posts !== consumed ? data : null;
  const hasPending = Boolean(pending);

  const revealed = wantsMore && hasPending;
  const visiblePosts = revealed ? [...posts, ...pending.posts] : posts;
  const visibleCursor = revealed ? pending.nextCursor : nextCursor;

  const fetchPage = (cursor) => {
    load(`/posts?cursor=${encodeURIComponent(cursor)}`);
  };

  // Prefetch the next page when the sentinel scrolls into view.
  useEffect(() => {
    if (!nextCursor || isLoading || hasPending || hasFailed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load(`/posts?cursor=${encodeURIComponent(nextCursor)}`);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [nextCursor, isLoading, hasPending, hasFailed, load]);

  useEffect(() => {
    if (!failedFetchRef.current && hasFailed) {
      const toastId = toast.error("Failed to fetch new posts");

      failedFetchRef.current = toastId;
    }
  }, [hasFailed]);

  const commit = (page) => {
    setPosts((prev) => [...prev, ...page.posts]);
    setNextCursor(page.nextCursor);
    setConsumed(page.posts);
  };

  const handleLoadMoreClick = () => {
    if (pending && !revealed) {
      // Prefetched page is waiting: show it, no request needed.
      commit(pending);
      setWantsMore(false);
    } else if (pending && revealed) {
      // Page already on screen: lock it in and start the next one.
      commit(pending);
      setWantsMore(true);
      fetchPage(pending.nextCursor);
    } else {
      // Nothing ready (first click, in flight, or retry after failure).
      setWantsMore(true);
      if (!isLoading) fetchPage(nextCursor);
    }
  };

  let buttonText = "Load more";
  if (hasFailed) {
    buttonText = "Try again";
  } else if (isLoading && wantsMore) {
    buttonText = "Loading...";
  }

  return (
    <div className="gap-4 flex flex-col">
      {visiblePosts.length > 0 ? (
        visiblePosts.map((post) => (
          <Card
            key={post.id}
            className={`animate-slide-up border rounded-lg bg-card max-w-2xl w-full p-4 mx-auto`}
          >
            <CardContent>
              <h2>
                <Link
                  to={`/post/${post.slug}`}
                  className="hover:text-primary text-foreground text-xl font-bold"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted-foreground">{post.subtitle}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))
      ) : (
        <div>No posts generated.</div>
      )}

      {hasFailed && (
        <p className="text-destructive text-center">
          Couldn&apos;t load more posts.
        </p>
      )}

      {visibleCursor ? (
        <div className="py-6 text-center">
          <button
            ref={loadMoreRef}
            onClick={handleLoadMoreClick}
            disabled={isLoading && wantsMore}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md transition-all disabled:opacity-50"
          >
            {buttonText}
          </button>
        </div>
      ) : visiblePosts.length > 0 ? (
        <span className="mx-auto my-3 italic text-secondary-foreground">
          You have reached the end of the blog posts.
        </span>
      ) : null}
    </div>
  );
}
