import { PrismaClient } from '@prisma/client';
import { ActionFunction, LoaderFunction, redirect, json } from '@remix-run/node';
import { useLoaderData, Form, useActionData } from '@remix-run/react';
import { encodeToShortCode, fetchTitle } from '~/utils';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
  return json({ message: "Welcome to the URL Shortener!" });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const originalUrl = formData.get('url') as string;

  try {
    new URL(originalUrl);
  } catch (error) {
    return json({ error: "Invalid URL provided" }, { status: 400 });
  }

  let shortCode: string;
  let isUnique = false;

  while (!isUnique) {
    shortCode = encodeToShortCode(Math.floor(Math.random() * 1000000));
    const existingUrl = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!existingUrl) {
      isUnique = true;
    }
  }

  const url = await prisma.url.create({
    data: {
      original: originalUrl,
      shortCode,
    },
  });

  const title = await fetchTitle(originalUrl);

  await prisma.url.update({
    where: { id: url.id },
    data: { title },
  });

  return redirect(`/top100`);
};

export default function Index() {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1>{data.message}</h1>
      <Form method="post">
        <input type="text" name="url" placeholder="Enter URL" required />
        {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
        <button type="submit">Shorten URL</button>
      </Form>
    </div>
  );
}









