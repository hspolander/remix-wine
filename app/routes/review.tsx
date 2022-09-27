import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

type LoaderData = {
  countries: Array<{ country: string }>;
  colors: Array<{ categoryLevel2: string }>;
};

export const loader: LoaderFunction = async () => {
  const countries = await db.systembolagetWine.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  const colors = await db.systembolagetWine.findMany({
    select: { categoryLevel2: true },
    distinct: ["categoryLevel2"],
    orderBy: { categoryLevel2: "asc" },
  });

  const data: LoaderData = {
    countries,
    colors,
  };

  return json(data);
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    categoryLevel2: string | undefined;
    country: string | undefined;
    name: string | undefined;
  };
  fields?: {
    categoryLevel2?: string;
    country?: string;
    name?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const categoryLevel2 = form.get("categoryLevel2");
  const country = form.get("country");
  const name = form.get("name");

  if (
    (categoryLevel2 && typeof categoryLevel2 !== "string") ||
    (country && typeof country !== "string") ||
    (name && typeof name !== "string")
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  return null;
};

export default function ReviewRoute() {
  const actionData = useActionData<ActionData>();
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Review Wine</h1>
      <Form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Country:{" "}
            <select name="country" id="country-select">
              <option key="" value="">
                Select:
              </option>
              {loaderData.countries.map(({ country }) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          {actionData?.fieldErrors?.country ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.country}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Color:{" "}
            <select name="categoryLevel2" id="color-select">
              <option key="" value="">
                Select:
              </option>
              {loaderData.colors.map(({ categoryLevel2 }) => (
                <option key={categoryLevel2} value={categoryLevel2}>
                  {categoryLevel2}
                </option>
              ))}
            </select>
          </label>
          {actionData?.fieldErrors?.categoryLevel2 ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.categoryLevel2}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Search
          </button>
        </div>
      </Form>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
