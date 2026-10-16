import App from "@/App";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";
import { loginAction } from "@/lib/loginHelper";
import { registerAction } from "@/lib/registerHelper";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RestrictAuth from "@/components/RestrictAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
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
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <div>Some content to view after authentication</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
