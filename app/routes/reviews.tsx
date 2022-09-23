import { Outlet } from "@remix-run/react";

export default function ReviewsRoute() {
  return (
    <div>
      <h1>Reviews</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
