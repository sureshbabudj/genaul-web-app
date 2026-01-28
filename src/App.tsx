// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Landing from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RecallSession from "./pages/Recall";

// Replace with real auth state (context, loader, etc.)
const authed = true; // Example

const router = createBrowserRouter([
  // Public landing at "/"
  { path: "/", Component: Landing },

  // Structural-only protected group (no path on parent)
  {
    // no `path` -> this is a layout-only "route group"
    Component() {
      return (
        <ProtectedRoute authed={authed}>
          <ProtectedLayout />
        </ProtectedRoute>
      );
    },
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/recall", Component: RecallSession },
    ],
  },
  { path: "/privacy-policy", Component: PrivacyPolicy },
  { path: "/terms-and-conditions", Component: TermsAndConditions },

  // (Optional) 404
  // { path: "*", Component: NotFound },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
