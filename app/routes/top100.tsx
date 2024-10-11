import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

const prisma = new PrismaClient();

type ShortUrl = {
  id: string;
  original: string;
  shortCode: string;
  title?: string;
  visits: number;
};

export async function loader() {
  const topUrls = await prisma.url.findMany({
    orderBy: { visits: "desc" },
    take: 100,
  });

  return { topUrls };
}

export default function Top100() {
  const { topUrls }: { topUrls: ShortUrl[] } = useLoaderData();
  return (
    <div>
      <h1>Top 100 Most Accessed URLs</h1>
      <ul>
        {topUrls.map((url) => (
          <li key={url.id}>
            <a href={url.original} target="_blank">{url.title ?? url.original}</a> - {url.visits} visits
          </li>
        ))}
      </ul>
    </div>
  );
}
