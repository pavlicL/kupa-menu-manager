import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MenuList } from "@/components/site/MenuList";
import { menuQuery } from "@/lib/menu";
import hero from "@/assets/terasa-kupa.png.asset.json";
import friedFish from "@/assets/fried-fish.png.asset.json";
import interior from "@/assets/interior.png.asset.json";
import wines from "@/assets/kast-wines.png.asset.json";
import catering from "@/assets/catering.png.asset.json";

const title = "Restoran Kvaka – Karlovac, na obali Kupe";
const description =
  "Obiteljski restoran na obali rijeke Kupe u Karlovcu. Domaća jela, riječni specijaliteti, terasa uz vodu i catering za vaše proslave.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(menuQuery),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative flex h-[70vh] min-h-[480px] items-center justify-center overflow-hidden">
        <img
          src={hero}
          alt="Pogled na rijeku Kupu s terase restorana"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 px-6 text-center text-river-foreground">
          <p className="eyebrow mb-5 text-river-foreground/90">Restoran Kvaka • Karlovac</p>
          <h1 className="font-serif text-5xl leading-tight drop-shadow-lg md:text-7xl">
            Uz smaragdnu Kupu
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-xl italic text-river-foreground/90 drop-shadow md:text-2xl">
            okus tradicije i vrhunske gastronomije
          </p>
          <Link
            to="/jelovnik"
            className="mt-10 inline-flex bg-gold px-8 py-3 font-condensed text-base uppercase tracking-widest text-gold-foreground transition-colors hover:bg-gold/90"
          >
            Pogledaj jelovnik
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-4 text-gold">Na obali Kupe</p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Mirno poslijepodne, dobra hrana i pogled na vodu
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-foreground/75">
            Kvaka je obiteljski restoran smješten na samoj obali rijeke Kupe u Karlovcu. Kuhamo
            domaće – od drniškog pršuta i pohanog sira do riječnih specijaliteta i rižota – a
            ljeti vas čeka terasa u hladu starih stabala.
          </p>
          <Link
            to="/kontakt"
            className="mt-8 inline-flex border-b-2 border-gold pb-1 font-condensed text-base uppercase tracking-widest transition-colors hover:text-gold"
          >
            Kako do nas
          </Link>
        </div>
        <div className="relative">
          <img
            src={friedFish.url}
            alt="Pržena riba na drvenoj dasci uz rijeku"
            className="aspect-[4/5] w-full object-cover shadow-elegant"
          />
          <div className="absolute -bottom-4 -left-4 h-32 w-4 bg-gold md:h-48" />
        </div>
      </section>

      {/* Menu excerpt */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Suspense fallback={<p className="text-center text-muted-foreground">Učitavanje jelovnika…</p>}>
          <MenuList limit={2} />
        </Suspense>
        <div className="text-center">
          <Link
            to="/jelovnik"
            className="inline-flex bg-river px-8 py-3 font-condensed text-base uppercase tracking-widest text-river-foreground transition-colors hover:bg-gold"
          >
            Cijeli jelovnik
          </Link>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="bg-river py-20 text-river-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-serif text-4xl text-gold">Ugođaj uz Kupu</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { src: catering.url, label: "Catering i proslave", alt: "Catering uz rijeku Kupu" },
              { src: interior.url, label: "Interijer", alt: "Unutrašnjost restorana" },
              { src: wines.url, label: "Vinska karta", alt: "Vina KAST" },
            ].map((g) => (
              <figure key={g.label} className="group relative aspect-square overflow-hidden">
                <img
                  src={g.src}
                  alt={g.alt}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-river/70 px-4 py-3 font-condensed text-sm uppercase tracking-widest">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/galerija"
              className="inline-flex border-b border-gold pb-1 font-condensed text-base uppercase tracking-widest text-gold transition-colors hover:text-river-foreground"
            >
              Pogledaj galeriju
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
