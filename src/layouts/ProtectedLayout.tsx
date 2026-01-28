import { Outlet } from "react-router";

export default function ProtectedLayout() {
  // Put shared UI or context providers here (header/sidebar, etc.)
  return (
    <div className="app-shell min-w-sm min-h-dvh">
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
