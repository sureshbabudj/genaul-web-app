import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import Landing from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RecallSession from "./pages/Recall";
import NotFound from "./pages/Notfound";
import Settings from "./pages/Settings";
import OGImageTemplate from "./pages/OGImageTemplate";

const router = createBrowserRouter([
  {
    path: "/og-template",
    Component: OGImageTemplate,
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/recall", Component: RecallSession },
      { path: "/settings", Component: Settings },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: "/", Component: Landing },
      { path: "/privacy-policy", Component: PrivacyPolicy },
      { path: "/terms-and-conditions", Component: TermsAndConditions },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
