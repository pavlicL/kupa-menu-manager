import { useSuspenseQuery } from "@tanstack/react-query";
import { seasonalQuery } from "@/lib/seasonal";

export function SeasonalSection() {
  const { data } = useSuspenseQuery(seasonalQuery);
  const visible = data.filter((item) => item.is_visible);
  if (!visible.length) return null;
  return (
    <section className="bg-secondary py-16 md:py-24" id="novosti">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow mb-3 text-gold">Iz Kvake</p>
        <h2 className="mb-10 font-serif text-4xl md:text-5xl">Sezonske novosti</h2>
        <div className="space-y-14">
          {visible.map((item) => (
            <article key={item.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              {item.image_url && <img src={item.image_url} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
              <div>
                <div className="mb-5 h-1 w-12 bg-gold" />
                <h3 className="font-serif text-3xl md:text-4xl">{item.title}</h3>
                {item.body && <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/75">{item.body}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
