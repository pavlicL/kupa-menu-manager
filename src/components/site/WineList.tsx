import { useSuspenseQuery } from "@tanstack/react-query";
import { winesQuery } from "@/lib/wines";
import { formatPrice } from "@/lib/menu";

export function WineList() {
  const { data } = useSuspenseQuery(winesQuery);
  return (
    <div className="grid gap-x-14 gap-y-14 lg:grid-cols-2">
      {data.filter((category) => category.is_visible).map((category) => (
        <section key={category.id}>
          <h2 className="mb-6 border-b-2 border-gold pb-3 font-condensed text-3xl uppercase">{category.name}</h2>
          <div className="space-y-4">
            {category.wines.filter((wine) => wine.is_visible).map((wine) => (
              <div key={wine.id} className="border-b border-border/70 pb-4">
                <h3 className="font-serif text-lg font-semibold">{wine.name}</h3>
                <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 font-condensed text-base text-foreground/80">
                  <span>{wine.bottle_size} · <strong className="text-foreground">{formatPrice(wine.bottle_price)}</strong></span>
                  {wine.glass_size && wine.glass_price !== null && <span>{wine.glass_size} · <strong className="text-foreground">{formatPrice(wine.glass_price)}</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
