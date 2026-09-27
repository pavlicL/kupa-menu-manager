import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CONTACT, MAP_SRC, OPENING_HOURS } from "@/lib/business";
import catering from "@/assets/catering.png.asset.json";

const title = "Kontakt i rezervacije – Restoran Kvaka Karlovac";
const description =
  "Rezervirajte stol ili upitajte za catering i proslave. Restoran Kvaka, Žorovica ul. 3, Karlovac, uz rijeku Kupu.";

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
                {CONTACT.street}
                <br />
                {CONTACT.city}
              </dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-gold">Telefon</dt>
              <dd className="text-lg">
                <a href={CONTACT.phoneHref} className="hover:text-gold">
                  {CONTACT.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-gold">E-mail</dt>
              <dd className="text-lg lowercase">
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                  {CONTACT.email}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 border border-gold/25 bg-river/5 p-6">
            <h2 className="mb-4 font-condensed text-sm uppercase tracking-widest text-gold">
              Radno vrijeme
            </h2>
            <ul className="font-condensed text-lg uppercase tracking-widest">
              {OPENING_HOURS.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 border-b border-gold/10 py-2 last:border-0"
                >
                  <span className="text-foreground/80">{row.day}</span>
                  <span
                    className={
                      row.hours === "Zatvoreno"
                        ? "text-foreground/45"
                        : "text-gold"
                    }
                  >
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={CONTACT.phoneHref}
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
            title="Karta – Restoran Kvaka, Žorovica, Karlovac"
            src={MAP_SRC}
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
