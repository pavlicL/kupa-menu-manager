import { useSuspenseQuery } from "@tanstack/react-query";
import { menuQuery, formatPrice } from "@/lib/menu";

export function MenuList({ limit }: { limit?: number }) {
  const { data } = useSuspenseQuery(menuQuery);
  const categories = (limit ? data.slice(0, limit) : data).filter((c) => c.is_visible);

  return (
    <div className="flex flex-col gap-12 md:flex-row md:gap-16">
      <div className="hidden shrink-0 md:flex md:w-1/4 md:justify-center md:border-r md:border-gold/10 md:pr-8">
        <div className="menu-bar sticky top-28 flex h-[420px] w-16 items-center justify-center text-4xl">
          JELOVNIK
        </div>
      </div>

      <div className="flex-1">
        {categories.map((cat) => (
          <section key={cat.id} className="mb-16" id={cat.id}>
            <div className="mb-8 border-b-2 border-gold pb-2">
              <h2 className="font-condensed text-4xl uppercase tracking-tight">{cat.name}</h2>
            </div>
            <div className="space-y-7">
              {cat.items
                .filter((i) => i.is_visible)
                .map((item) => (
                  <div key={item.id} className="group border-b border-river/5 pb-6">
                    <div className="mb-1 flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-xl font-bold italic transition-colors group-hover:text-gold">
                        {item.name}{" "}
                        <span className="font-sans text-xs font-normal not-italic text-muted-foreground">
                          ({item.unit})
                        </span>
                      </h3>
                      <span className="shrink-0 font-condensed text-xl font-bold">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="max-w-lg text-sm leading-relaxed text-foreground/70">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              {cat.items.filter((i) => i.is_visible).length === 0 && (
                <p className="text-sm italic text-muted-foreground">Uskoro.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
