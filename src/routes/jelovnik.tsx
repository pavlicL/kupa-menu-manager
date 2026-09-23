import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MenuList } from "@/components/site/MenuList";
import { menuQuery } from "@/lib/menu";

const title = "Jelovnik – Restoran Kvaka Karlovac";
const description =
  "Predjela, juhe, tjestenine i rižota – domaća jela i riječni specijaliteti Restorana Kvaka na obali Kupe u Karlovcu.";

export const Route = createFileRoute("/jelovnik")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: ({ context }) => context.queryClient.prefetchQuery(menuQuery),
  component: JelovnikPage,
});

function JelovnikPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-16 text-center md:text-left">
        <p className="eyebrow mb-3 text-gold">Restoran Kvaka</p>
        <h1 className="font-serif text-5xl md:text-6xl">Jelovnik</h1>
        <p className="mt-4 max-w-xl text-foreground/70">
          Sve cijene su u eurima. Za dnevnu ponudu i alergene slobodno upitajte osoblje.
        </p>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <Suspense fallback={<p className="text-muted-foreground">Učitavanje jelovnika…</p>}>
          <MenuList />
        </Suspense>
      </section>
    </SiteLayout>
  );
}
