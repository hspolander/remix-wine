import type { LoaderFunction } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import type { Wine } from "@prisma/client";

export const loader: LoaderFunction = async (params) => {
  console.log(params);
};

export default function JokesIndexRoute() {
  return <div></div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no jokes to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
