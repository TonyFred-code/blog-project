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
import {
  createNewPostAction,
  editPostAction,
  editPostLoader,
  managePostLoader,
  viewPostLoader,
} from "@/lib/postHelper";
import Post from "@/pages/Post";
import { indexLoader, postsLoader } from "@/lib/indexHelper";
import ErrorPage from "@/pages/ErrorPage";
import EditPost from "@/pages/EditPost";
import { Loader } from "lucide-react";
import ManagePost from "@/pages/ManagePost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin size-9 text-secondary-foreground" />
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
        path: "post/:slug/edit",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
        loader: editPostLoader,
        action: editPostAction,
      },
      {
        path: "post/:slug/manage",
        element: (
          <ProtectedRoute>
            <ManagePost />
          </ProtectedRoute>
        ),
        loader: managePostLoader,
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
