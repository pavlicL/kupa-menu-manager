import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WineList } from "@/components/site/WineList";
import { winesQuery } from "@/lib/wines";
import hero from "@/assets/kvaka-wines-table.png.asset.json";

const title = "Vinska karta – Restoran Kvaka Karlovac";
const description =
  "Sortna i buteljirana bijela, crvena i pjenušava vina uz jelovnik Restorana Kvaka na obali Kupe u Karlovcu.";

export const Route = createFileRoute("/vinska-karta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(winesQuery),
  component: VinskaKartaPage,
});

function VinskaKartaPage() {
  return (
    <SiteLayout>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img
          src={hero.url}
          alt="Vinska karta Restorana Kvaka"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 px-6 text-center text-river-foreground">
          <p className="eyebrow mb-3 text-river-foreground/90">Restoran Kvaka</p>
          <h1 className="font-serif text-5xl drop-shadow-lg md:text-6xl">Vinska karta</h1>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <Suspense
          fallback={<p className="text-center text-muted-foreground">Učitavanje vinske karte…</p>}
        >
          <WineList />
        </Suspense>
      </section>
    </SiteLayout>
  );
}
