import App from "@/App";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";
import { loginAction } from "@/lib/loginHelper";
import { registerAction } from "@/lib/registerHelper";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RestrictAuth from "@/components/RestrictAuth";
import CreatePost from "@/pages/CreatePost";
import { createNewPostAction, viewPostLoader } from "@/lib/postHelper";
import Editor from "@/components/Editor";
import Post from "@/pages/Post";
import { indexLoader, postsLoader } from "@/lib/indexHelper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    hydrateFallbackElement: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-6 rounded-full bg-foreground animate-ping"></div>
      </div>
    ),
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "login",
        element: (
          <RestrictAuth>
            <Login />
          </RestrictAuth>
        ),
        action: loginAction,
      },
      {
        path: "register",
        element: (
          <RestrictAuth>
            <Register />
          </RestrictAuth>
        ),
        action: registerAction,
      },
      {
        path: "new",
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
        action: createNewPostAction,
      },
      {
        path: "editor",
        element: (
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        ),
      },
      {
        path: "post/:slug",
        element: <Post />,
        loader: viewPostLoader,
      },
      {
        path: "posts",
        loader: postsLoader,
      },
    ],
  },
]);

export default router;
