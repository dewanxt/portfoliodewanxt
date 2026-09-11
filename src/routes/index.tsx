import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Md. Sabbir Hossain Dewan — Front-End Developer" },
      { name: "description", content: "Portfolio of Md. Sabbir Hossain Dewan, a Front-End Developer creating purposeful, responsive digital experiences." },
      { property: "og:title", content: "Md. Sabbir Hossain Dewan — Front-End Developer" },
      { property: "og:description", content: "Explore the cinematic portfolio of Front-End Developer Md. Sabbir Hossain Dewan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Portfolio />;
}
