import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import friedFish from "@/assets/fried-fish.png.asset.json";
import interior from "@/assets/interior.png.asset.json";
import wines from "@/assets/kast-wines.png.asset.json";
import catering from "@/assets/catering.png.asset.json";
import hero from "@/assets/terasa-kupa.png.asset.json";

const title = "Galerija – Restoran Kvaka Karlovac";
const description =
  "Fotografije terase na Kupi, interijera, jela i proslava u Restoranu Kvaka u Karlovcu.";

export const Route = createFileRoute("/galerija")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: GalerijaPage,
});

const photos = [
  { src: hero.url, alt: "Rijeka Kupa s terase", span: "md:col-span-2" },
  { src: friedFish.url, alt: "Pržena riba na dasci uz rijeku", span: "md:row-span-2" },
  { src: catering.url, alt: "Catering uz rijeku Kupu", span: "" },
  { src: interior.url, alt: "Unutrašnjost restorana", span: "" },
  { src: wines.url, alt: "Vina KAST", span: "" },
];

function GalerijaPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
        <p className="eyebrow mb-3 text-gold">Ugođaj</p>
        <h1 className="font-serif text-5xl md:text-6xl">Galerija</h1>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.alt} className={`overflow-hidden ${p.span}`}>
              <img
                src={p.src}
                alt={p.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
