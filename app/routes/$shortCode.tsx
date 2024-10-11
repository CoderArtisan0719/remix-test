import { PrismaClient } from '@prisma/client';
import { redirect } from '@remix-run/node';

const prisma = new PrismaClient();

export async function loader({ params }: any) {
  const { shortCode } = params;

  const url = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (!url) {
    throw new Response("URL not found", { status: 404 });
  }

  console.log(`URL found: ${url.original}, visits before increment: ${url.visits}`);

  await prisma.url.update({
    where: { shortCode },
    data: { visits: { increment: 1 } },
  });

  return redirect(url.original);
}
