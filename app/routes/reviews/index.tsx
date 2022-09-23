import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useCatch } from "@remix-run/react";
import type { Wine } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { randomWine: Wine };

export const loader: LoaderFunction = async () => {
  const count = await db.wine.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomWine] = await db.wine.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomWine) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }
  const data: LoaderData = { randomWine };
  return json(data);
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomWine.name}</p>
      <Link to={data.randomWine.id}>"{data.randomWine.name}" Permalink</Link>
    </div>
  );
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
