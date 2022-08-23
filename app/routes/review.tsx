import { Outlet } from "@remix-run/react";

export default function ReviewRoute() {
  return (
    <div>
      <h1>Review Wine</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
