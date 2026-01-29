// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router";

import { ProtectedLayout } from "./layouts/ProtectedLayout";

import Landing from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RecallSession from "./pages/Recall";

const router = createBrowserRouter([
  // Public landing at "/"
  { path: "/", Component: Landing },

  // Structural-only protected group (no path on parent)
  {
    element: <ProtectedLayout />,
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
