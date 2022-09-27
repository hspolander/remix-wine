import type { SystembolagetWine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = SystembolagetWine[];
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const categoryLevel2 = url.searchParams.get("categoryLevel2") || "";
  const country = url.searchParams.get("country") || "";
  const name = url.searchParams.get("name") || "";

  const systembolagetWines = await db.systembolagetWine.findMany({
    where: {
      AND: [
        { categoryLevel2: { contains: categoryLevel2 } },
        { country: { contains: country } },
        {
          OR: [
            { productNameBold: { contains: name } },
            { productNameThin: { contains: name } },
          ],
        },
      ],
    },
  });
  return json(systembolagetWines);
};

export default function ReviewIndexRoute() {
  const data = useLoaderData<LoaderData>();
  console.log(data);
  return <div>{data.map((wine) => wine.productNameBold)}</div>;
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
