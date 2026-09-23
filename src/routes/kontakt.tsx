import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import catering from "@/assets/catering.png.asset.json";

const title = "Kontakt i rezervacije – Restoran Kvaka Karlovac";
const description =
  "Rezervirajte stol ili upitajte za catering i proslave. Restoran Kvaka, obala rijeke Kupe, Karlovac.";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3 text-gold">Dobrodošli</p>
          <h1 className="font-serif text-5xl md:text-6xl">Kontakt</h1>
          <p className="mt-6 max-w-md leading-relaxed text-foreground/75">
            Za rezervacije stola, proslave, krštenja, poslovne ručkove i catering na vašoj
            lokaciji – nazovite nas ili pošaljite poruku.
          </p>

          <dl className="mt-10 grid gap-8 font-condensed uppercase tracking-widest sm:grid-cols-2">
            <div>
              <dt className="mb-2 text-sm text-gold">Adresa</dt>
              <dd className="text-lg">
                Obala rijeke Kupe
                <br />
                47000 Karlovac
              </dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-gold">Radno vrijeme</dt>
              <dd className="text-lg">
                Pon – Ned
                <br />
                10:00 – 23:00
              </dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-gold">Telefon</dt>
              <dd className="text-lg">
                <a href="tel:+38547000000" className="hover:text-gold">
                  +385 47 000 000
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-gold">E-mail</dt>
              <dd className="text-lg lowercase">
                <a href="mailto:info@restoran-kvaka.hr" className="hover:text-gold">
                  info@restoran-kvaka.hr
                </a>
              </dd>
            </div>
          </dl>

          <a
            href="tel:+38547000000"
            className="mt-10 inline-flex bg-gold px-8 py-3 font-condensed text-base uppercase tracking-widest text-gold-foreground transition-colors hover:bg-gold/90"
          >
            Rezerviraj stol
          </a>
        </div>
        <div className="relative">
          <img
            src={catering.url}
            alt="Catering uz rijeku Kupu"
            className="aspect-[4/5] w-full object-cover shadow-elegant"
          />
          <div className="absolute -right-4 -top-4 h-40 w-4 bg-gold" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden border border-gold/20">
          <iframe
            title="Karta – Karlovac, rijeka Kupa"
            src="https://www.openstreetmap.org/export/embed.html?bbox=15.53%2C45.48%2C15.58%2C45.51&layer=mapnik&marker=45.495%2C15.555"
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
