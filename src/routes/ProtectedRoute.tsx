import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // This ensures data doesn't refetch too aggressively
      // unless we explicitly tell it to
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
