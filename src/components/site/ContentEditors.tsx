import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { winesQuery, type Wine, type WineCategory } from "@/lib/wines";
import { seasonalQuery, type SeasonalNews } from "@/lib/seasonal";
import { formatPrice } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import soup from "@/assets/kvaka-seasonal-soup.png.asset.json";

function Action({ title, onClick, children, disabled }: { title: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return <Button type="button" size="icon" variant="ghost" title={title} aria-label={title} onClick={onClick} disabled={disabled}>{children}</Button>;
}

export function WineEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(winesQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["wines"] });
  const [newCategory, setNewCategory] = useState("");
  if (isLoading || !data) return <p>Učitavanje vinske karte…</p>;
  const addCategory = async (event: FormEvent) => {
    event.preventDefault();
    if (!newCategory.trim()) return;
    const { error } = await supabase.from("wine_categories").insert({ name: newCategory.trim(), sort_order: data.length + 1 });
    if (error) return toast.error(error.message);
    setNewCategory(""); refresh();
  };
  return <section className="space-y-8 border-t-2 border-gold pt-10" id="admin-wines">
    <h2 className="font-serif text-4xl">Vinska karta</h2>
    {data.map((category, index) => <WineCategoryEditor key={category.id} category={category} siblings={data} index={index} refresh={refresh} />)}
    <form onSubmit={addCategory} className="flex flex-wrap gap-3">
      <Input className="max-w-sm" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nova kategorija vina" aria-label="Nova kategorija vina" />
      <Button type="submit"><Plus /> Dodaj kategoriju</Button>
    </form>
  </section>;
}

function WineCategoryEditor({ category, siblings, index, refresh }: { category: WineCategory; siblings: WineCategory[]; index: number; refresh: () => void }) {
  const [name, setName] = useState(category.name);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const update = async (changes: Partial<WineCategory>) => {
    const { error } = await supabase.from("wine_categories").update(changes).eq("id", category.id);
    if (error) toast.error(error.message); else refresh();
  };
  const move = async (direction: -1 | 1) => {
    const other = siblings[index + direction];
    if (!other) return;
    const [a, b] = await Promise.all([
      supabase.from("wine_categories").update({ sort_order: other.sort_order }).eq("id", category.id),
      supabase.from("wine_categories").update({ sort_order: category.sort_order }).eq("id", other.id),
    ]);
    if (a.error || b.error) toast.error("Premještanje nije uspjelo"); else refresh();
  };
  return <div className={`border-b border-border pb-8 ${category.is_visible ? "" : "opacity-60"}`}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
      {editing ? <div className="flex gap-2"><Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Naziv kategorije" /><Action title="Spremi" onClick={() => { if (name.trim()) { update({ name: name.trim() }); setEditing(false); } }}>✓</Action><Action title="Odustani" onClick={() => { setName(category.name); setEditing(false); }}><X /></Action></div> : <h3 className="font-condensed text-3xl uppercase">{category.name}{!category.is_visible && " (skriveno)"}</h3>}
      <div className="flex flex-wrap">
        <Action title="Gore" onClick={() => move(-1)} disabled={index === 0}><ArrowUp /></Action>
        <Action title="Dolje" onClick={() => move(1)} disabled={index === siblings.length - 1}><ArrowDown /></Action>
        <Action title="Preimenuj" onClick={() => setEditing(true)}><Pencil /></Action>
        <Action title={category.is_visible ? "Sakrij" : "Prikaži"} onClick={() => update({ is_visible: !category.is_visible })}>{category.is_visible ? <Eye /> : <EyeOff />}</Action>
        <Action title="Obriši kategoriju" onClick={async () => { if (!confirm(`Obrisati kategoriju „${category.name}” i sva vina?`)) return; const { error } = await supabase.from("wine_categories").delete().eq("id", category.id); if (error) toast.error(error.message); else refresh(); }}><Trash2 /></Action>
      </div>
    </div>
    <div className="space-y-2">
      {category.wines.map((wine, wineIndex) => <WineRow key={wine.id} wine={wine} siblings={category.wines} index={wineIndex} refresh={refresh} />)}
    </div>
    {adding ? <WineForm categoryId={category.id} sortOrder={category.wines.length + 1} done={() => { setAdding(false); refresh(); }} cancel={() => setAdding(false)} /> : <Button type="button" variant="outline" className="mt-4" onClick={() => setAdding(true)}><Plus /> Dodaj vino</Button>}
  </div>;
}

function WineRow({ wine, siblings, index, refresh }: { wine: Wine; siblings: Wine[]; index: number; refresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const move = async (direction: -1 | 1) => {
    const other = siblings[index + direction];
    if (!other) return;
    const [a, b] = await Promise.all([
      supabase.from("wines").update({ sort_order: other.sort_order }).eq("id", wine.id),
      supabase.from("wines").update({ sort_order: wine.sort_order }).eq("id", other.id),
    ]);
    if (a.error || b.error) toast.error("Premještanje nije uspjelo"); else refresh();
  };
  if (editing) return <WineForm wine={wine} categoryId={wine.category_id} sortOrder={wine.sort_order} done={() => { setEditing(false); refresh(); }} cancel={() => setEditing(false)} />;
  return <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-border/60 py-2 ${wine.is_visible ? "" : "opacity-50"}`}>
    <div><strong className="font-serif">{wine.name}</strong><span className="ml-2 text-sm text-muted-foreground">{wine.bottle_size} · {formatPrice(wine.bottle_price)}{wine.glass_size && wine.glass_price !== null ? ` / ${wine.glass_size} · ${formatPrice(wine.glass_price)}` : ""}</span></div>
    <div className="flex">
      <Action title="Gore" onClick={() => move(-1)} disabled={index === 0}><ArrowUp /></Action><Action title="Dolje" onClick={() => move(1)} disabled={index === siblings.length - 1}><ArrowDown /></Action>
      <Action title="Uredi vino" onClick={() => setEditing(true)}><Pencil /></Action>
      <Action title={wine.is_visible ? "Sakrij vino" : "Prikaži vino"} onClick={async () => { const { error } = await supabase.from("wines").update({ is_visible: !wine.is_visible }).eq("id", wine.id); if (error) toast.error(error.message); else refresh(); }}>{wine.is_visible ? <Eye /> : <EyeOff />}</Action>
      <Action title="Obriši vino" onClick={async () => { if (!confirm(`Obrisati „${wine.name}”?`)) return; const { error } = await supabase.from("wines").delete().eq("id", wine.id); if (error) toast.error(error.message); else refresh(); }}><Trash2 /></Action>
    </div>
  </div>;
}

function WineForm({ wine, categoryId, sortOrder, done, cancel }: { wine?: Wine; categoryId: string; sortOrder: number; done: () => void; cancel: () => void }) {
  const [name, setName] = useState(wine?.name ?? "");
  const [bottleSize, setBottleSize] = useState(wine?.bottle_size ?? "0,75 l");
  const [bottlePrice, setBottlePrice] = useState(String(wine?.bottle_price ?? ""));
  const [glassSize, setGlassSize] = useState(wine?.glass_size ?? "");
  const [glassPrice, setGlassPrice] = useState(String(wine?.glass_price ?? ""));
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const bottle = Number(bottlePrice.replace(",", "."));
    const glass = glassPrice.trim() ? Number(glassPrice.replace(",", ".")) : null;
    if (!name.trim() || !bottleSize.trim() || !Number.isFinite(bottle) || bottle < 0 || (glass !== null && (!glassSize.trim() || !Number.isFinite(glass) || glass < 0))) return toast.error("Provjerite naziv, veličine i cijene vina.");
    setBusy(true);
    const payload = { name: name.trim(), bottle_size: bottleSize.trim(), bottle_price: bottle, glass_size: glass === null ? null : glassSize.trim(), glass_price: glass };
    const { error } = wine ? await supabase.from("wines").update(payload).eq("id", wine.id) : await supabase.from("wines").insert({ ...payload, category_id: categoryId, sort_order: sortOrder });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Vino spremljeno"); done(); }
  };
  return <form onSubmit={submit} className="my-4 grid gap-3 bg-secondary p-4 sm:grid-cols-2">
    <div><Label>Naziv</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
    <div><Label>Veličina boce</Label><Input value={bottleSize} onChange={(e) => setBottleSize(e.target.value)} required /></div>
    <div><Label>Cijena boce (€)</Label><Input inputMode="decimal" value={bottlePrice} onChange={(e) => setBottlePrice(e.target.value)} required /></div>
    <div><Label>Veličina čaše (neobavezno)</Label><Input value={glassSize} onChange={(e) => setGlassSize(e.target.value)} /></div>
    <div><Label>Cijena čaše (€; neobavezno)</Label><Input inputMode="decimal" value={glassPrice} onChange={(e) => setGlassPrice(e.target.value)} /></div>
    <div className="flex items-end gap-2"><Button type="submit" disabled={busy}>Spremi</Button><Button type="button" variant="outline" onClick={cancel}>Odustani</Button></div>
  </form>;
}

export function SeasonalEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(seasonalQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["seasonal-news"] });
  const [adding, setAdding] = useState(false);
  if (isLoading || !data) return <p>Učitavanje novosti…</p>;
  return <section className="space-y-6 border-t-2 border-gold pt-10" id="admin-news">
    <h2 className="font-serif text-4xl">Sezonske novosti</h2>
    {data.map((item, index) => <NewsRow key={item.id} item={item} siblings={data} index={index} refresh={refresh} />)}
    {adding ? <NewsForm sortOrder={data.length + 1} done={() => { setAdding(false); refresh(); }} cancel={() => setAdding(false)} /> : <Button type="button" onClick={() => setAdding(true)}><Plus /> Dodaj novost</Button>}
  </section>;
}

function NewsRow({ item, siblings, index, refresh }: { item: SeasonalNews; siblings: SeasonalNews[]; index: number; refresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const move = async (direction: -1 | 1) => {
    const other = siblings[index + direction];
    if (!other) return;
    const [a, b] = await Promise.all([
      supabase.from("seasonal_news").update({ sort_order: other.sort_order }).eq("id", item.id),
      supabase.from("seasonal_news").update({ sort_order: item.sort_order }).eq("id", other.id),
    ]);
    if (a.error || b.error) toast.error("Premještanje nije uspjelo"); else refresh();
  };
  if (editing) return <NewsForm item={item} sortOrder={item.sort_order} done={() => { setEditing(false); refresh(); }} cancel={() => setEditing(false)} />;
  return <article className={`flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 ${item.is_visible ? "" : "opacity-50"}`}>
    <div><h3 className="font-serif text-xl">{item.title}</h3>{item.body && <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>}</div>
    <div className="flex">
      <Action title="Gore" onClick={() => move(-1)} disabled={index === 0}><ArrowUp /></Action><Action title="Dolje" onClick={() => move(1)} disabled={index === siblings.length - 1}><ArrowDown /></Action>
      <Action title="Uredi novost" onClick={() => setEditing(true)}><Pencil /></Action>
      <Action title={item.is_visible ? "Sakrij novost" : "Prikaži novost"} onClick={async () => { const { error } = await supabase.from("seasonal_news").update({ is_visible: !item.is_visible }).eq("id", item.id); if (error) toast.error(error.message); else refresh(); }}>{item.is_visible ? <Eye /> : <EyeOff />}</Action>
      <Action title="Obriši novost" onClick={async () => { if (!confirm(`Obrisati „${item.title}”?`)) return; const { error } = await supabase.from("seasonal_news").delete().eq("id", item.id); if (error) toast.error(error.message); else refresh(); }}><Trash2 /></Action>
    </div>
  </article>;
}

function NewsForm({ item, sortOrder, done, cancel }: { item?: SeasonalNews; sortOrder: number; done: () => void; cancel: () => void }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [body, setBody] = useState(item?.body ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!title.trim()) return;
    setBusy(true);
    const payload = { title: title.trim(), body: body.trim() || null, image_url: imageUrl || null };
    const { error } = item ? await supabase.from("seasonal_news").update(payload).eq("id", item.id) : await supabase.from("seasonal_news").insert({ ...payload, sort_order: sortOrder });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Novost spremljena"); done(); }
  };
  return <form onSubmit={submit} className="grid gap-4 bg-secondary p-5">
    <div><Label>Naslov</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
    <div><Label>Tekst</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} /></div>
    <div><Label htmlFor="news-photo">Fotografija</Label><select id="news-photo" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 h-10 w-full border border-input bg-background px-3 text-sm"><option value="">Bez fotografije</option><option value={soup.url}>Juha</option></select></div>
    <div className="flex gap-2"><Button type="submit" disabled={busy}>Spremi</Button><Button type="button" variant="outline" onClick={cancel}>Odustani</Button></div>
  </form>;
}
