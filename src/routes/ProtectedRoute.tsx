import { Navigate, useLocation } from "react-router";

export function ProtectedRoute({
  authed,
  children,
}: {
  authed: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();
  if (!authed) {
    // Send unauthenticated users to Landing (/) and preserve intent
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
