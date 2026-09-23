import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { menuQuery, formatPrice, type MenuCategory, type MenuItem } from "@/lib/menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/kvaka-logo.png.asset.json";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Uređivanje jelovnika – Restoran Kvaka" },
      { name: "description", content: "Administracija jelovnika Restorana Kvaka." },
      { property: "og:title", content: "Uređivanje jelovnika – Restoran Kvaka" },
      { property: "og:description", content: "Administracija jelovnika Restorana Kvaka." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/prijava" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Učitavanje…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-river text-river-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <img src={logo.url} alt="Kvaka" className="h-10 w-auto brightness-0 invert" />
            <span className="hidden font-condensed text-sm uppercase tracking-widest sm:inline">
              Uređivanje jelovnika
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/jelovnik" className="font-condensed uppercase tracking-widest hover:text-gold">
              Pogledaj stranicu
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="border border-river-foreground/30 px-3 py-1 font-condensed uppercase tracking-widest hover:bg-river-foreground/10"
            >
              Odjava
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {isAdmin ? (
          <MenuEditor />
        ) : (
          <div className="border border-gold/30 bg-accent/40 p-8">
            <h1 className="font-serif text-2xl">Račun još nema ovlasti za uređivanje</h1>
            <p className="mt-3 text-sm text-foreground/75">
              Prijavljeni ste kao <strong>{session.user.email}</strong>. Ovom računu treba dodijeliti
              ulogu vlasnika prije nego što može mijenjati jelovnik.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function MenuEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(menuQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["menu"] });
  const [newCat, setNewCat] = useState("");

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const { error } = await supabase
      .from("menu_categories")
      .insert({ name: newCat.trim(), sort_order: (data?.length ?? 0) + 1 });
    if (error) { toast.error(error.message); return; }
    setNewCat("");
    toast.success("Kategorija dodana");
    refresh();
  };

  if (isLoading || !data) return <p className="text-muted-foreground">Učitavanje…</p>;

  return (
    <div className="space-y-12">
      <div>
        <p className="eyebrow text-gold">Vlasnik</p>
        <h1 className="mt-2 font-serif text-4xl">Jelovnik</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Promjene su odmah vidljive gostima na stranici. Skrivene stavke ostaju spremljene, ali se ne prikazuju.
        </p>
      </div>

      {data.map((cat, idx) => (
        <CategoryEditor
          key={cat.id}
          category={cat}
          isFirst={idx === 0}
          isLast={idx === data.length - 1}
          siblings={data}
          onChange={refresh}
        />
      ))}

      <form onSubmit={addCategory} className="flex flex-col gap-3 border-t-2 border-gold pt-8 sm:flex-row">
        <Input
          placeholder="Nova kategorija (npr. Glavna jela, Deserti)"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-2 font-condensed text-sm uppercase tracking-widest text-gold-foreground hover:bg-gold/90">
          <Plus className="size-4" /> Dodaj kategoriju
        </button>
      </form>
    </div>
  );
}

function CategoryEditor({
  category,
  isFirst,
  isLast,
  siblings,
  onChange,
}: {
  category: MenuCategory;
  isFirst: boolean;
  isLast: boolean;
  siblings: MenuCategory[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [adding, setAdding] = useState(false);

  const save = async () => {
    const { error } = await supabase.from("menu_categories").update({ name }).eq("id", category.id);
    if (error) { toast.error(error.message); return; }
    setEditing(false);
    onChange();
  };

  const toggle = async () => {
    const { error } = await supabase
      .from("menu_categories")
      .update({ is_visible: !category.is_visible })
      .eq("id", category.id);
    if (error) { toast.error(error.message); return; }
    onChange();
  };

  const remove = async () => {
    if (!confirm(`Obrisati kategoriju "${category.name}" i sva njezina jela?`)) return;
    const { error } = await supabase.from("menu_categories").delete().eq("id", category.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Kategorija obrisana");
    onChange();
  };

  const move = async (dir: -1 | 1) => {
    const idx = siblings.findIndex((c) => c.id === category.id);
    const other = siblings[idx + dir];
    if (!other) return;
    const a = supabase.from("menu_categories").update({ sort_order: other.sort_order }).eq("id", category.id);
    const b = supabase.from("menu_categories").update({ sort_order: category.sort_order }).eq("id", other.id);
    const [r1, r2] = await Promise.all([a, b]);
    if (r1.error || r2.error) { toast.error("Premještanje nije uspjelo"); return; }
    onChange();
  };

  return (
    <section className={`border border-border bg-card p-6 ${category.is_visible ? "" : "opacity-60"}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-gold pb-3">
        {editing ? (
          <div className="flex flex-1 gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm" />
            <IconBtn onClick={save} label="Spremi">Spremi</IconBtn>
            <IconBtn onClick={() => setEditing(false)} label="Odustani"><X className="size-4" /></IconBtn>
          </div>
        ) : (
          <h2 className="font-condensed text-3xl uppercase tracking-tight">
            {category.name}
            {!category.is_visible && <span className="ml-3 text-sm text-muted-foreground">(skriveno)</span>}
          </h2>
        )}
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => move(-1)} disabled={isFirst} label="Pomakni gore"><ArrowUp className="size-4" /></IconBtn>
          <IconBtn onClick={() => move(1)} disabled={isLast} label="Pomakni dolje"><ArrowDown className="size-4" /></IconBtn>
          <IconBtn onClick={() => setEditing(true)} label="Preimenuj"><Pencil className="size-4" /></IconBtn>
          <IconBtn onClick={toggle} label={category.is_visible ? "Sakrij" : "Prikaži"}>
            {category.is_visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </IconBtn>
          <IconBtn onClick={remove} label="Obriši" danger><Trash2 className="size-4" /></IconBtn>
        </div>
      </div>

      <div className="space-y-3">
        {category.items.map((item, i) => (
          <ItemRow
            key={item.id}
            item={item}
            isFirst={i === 0}
            isLast={i === category.items.length - 1}
            siblings={category.items}
            onChange={onChange}
          />
        ))}
        {category.items.length === 0 && !adding && (
          <p className="text-sm italic text-muted-foreground">Još nema jela u ovoj kategoriji.</p>
        )}
      </div>

      {adding ? (
        <ItemForm
          categoryId={category.id}
          nextOrder={category.items.length + 1}
          onDone={() => {
            setAdding(false);
            onChange();
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-5 inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-widest text-gold hover:underline"
        >
          <Plus className="size-4" /> Dodaj jelo
        </button>
      )}
    </section>
  );
}

function ItemRow({
  item,
  isFirst,
  isLast,
  siblings,
  onChange,
}: {
  item: MenuItem;
  isFirst: boolean;
  isLast: boolean;
  siblings: MenuItem[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);

  const toggle = async () => {
    const { error } = await supabase.from("menu_items").update({ is_visible: !item.is_visible }).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    onChange();
  };

  const remove = async () => {
    if (!confirm(`Obrisati "${item.name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Jelo obrisano");
    onChange();
  };

  const move = async (dir: -1 | 1) => {
    const idx = siblings.findIndex((c) => c.id === item.id);
    const other = siblings[idx + dir];
    if (!other) return;
    const [r1, r2] = await Promise.all([
      supabase.from("menu_items").update({ sort_order: other.sort_order }).eq("id", item.id),
      supabase.from("menu_items").update({ sort_order: item.sort_order }).eq("id", other.id),
    ]);
    if (r1.error || r2.error) { toast.error("Premještanje nije uspjelo"); return; }
    onChange();
  };

  if (editing) {
    return (
      <ItemForm
        item={item}
        categoryId={item.category_id}
        nextOrder={item.sort_order}
        onDone={() => {
          setEditing(false);
          onChange();
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className={`flex items-start justify-between gap-4 border-b border-river/5 pb-3 ${item.is_visible ? "" : "opacity-50"}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-lg font-bold italic">{item.name}</span>
          <span className="text-xs text-muted-foreground">({item.unit})</span>
          <span className="font-condensed text-lg font-bold">{formatPrice(item.price)}</span>
        </div>
        {item.description && <p className="text-sm text-foreground/70">{item.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconBtn onClick={() => move(-1)} disabled={isFirst} label="Gore"><ArrowUp className="size-4" /></IconBtn>
        <IconBtn onClick={() => move(1)} disabled={isLast} label="Dolje"><ArrowDown className="size-4" /></IconBtn>
        <IconBtn onClick={() => setEditing(true)} label="Uredi"><Pencil className="size-4" /></IconBtn>
        <IconBtn onClick={toggle} label={item.is_visible ? "Sakrij" : "Prikaži"}>
          {item.is_visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </IconBtn>
        <IconBtn onClick={remove} label="Obriši" danger><Trash2 className="size-4" /></IconBtn>
      </div>
    </div>
  );
}

function ItemForm({
  item,
  categoryId,
  nextOrder,
  onDone,
  onCancel,
}: {
  item?: MenuItem;
  categoryId: string;
  nextOrder: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [unit, setUnit] = useState(item?.unit ?? "por.");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = Number(price.replace(",", "."));
    if (!name.trim() || Number.isNaN(p)) { toast.error("Unesite naziv i ispravnu cijenu."); return; }
    setBusy(true);
    const payload = {
      name: name.trim(),
      unit: unit.trim() || "por.",
      price: p,
      description: description.trim() || null,
    };
    const { error } = item
      ? await supabase.from("menu_items").update(payload).eq("id", item.id)
      : await supabase.from("menu_items").insert({ ...payload, category_id: categoryId, sort_order: nextOrder });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(item ? "Jelo spremljeno" : "Jelo dodano");
    onDone();
  };

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 border border-gold/40 bg-accent/30 p-4 sm:grid-cols-6">
      <div className="space-y-1 sm:col-span-3">
        <Label htmlFor={`n-${item?.id ?? "new"}`}>Naziv</Label>
        <Input id={`n-${item?.id ?? "new"}`} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1 sm:col-span-1">
        <Label htmlFor={`u-${item?.id ?? "new"}`}>Jedinica</Label>
        <Input id={`u-${item?.id ?? "new"}`} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="por. / kg" />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor={`p-${item?.id ?? "new"}`}>Cijena (€)</Label>
        <Input id={`p-${item?.id ?? "new"}`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="space-y-1 sm:col-span-6">
        <Label htmlFor={`d-${item?.id ?? "new"}`}>Opis (sastojci)</Label>
        <Textarea id={`d-${item?.id ?? "new"}`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex gap-2 sm:col-span-6">
        <button
          type="submit"
          disabled={busy}
          className="bg-gold px-5 py-2 font-condensed text-sm uppercase tracking-widest text-gold-foreground hover:bg-gold/90 disabled:opacity-60"
        >
          {item ? "Spremi" : "Dodaj"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 font-condensed text-sm uppercase tracking-widest hover:text-gold">
          Odustani
        </button>
      </div>
    </form>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 min-w-8 items-center justify-center px-2 text-xs transition-colors hover:bg-accent disabled:opacity-30 ${danger ? "text-destructive hover:bg-destructive/10" : ""}`}
    >
      {children}
    </button>
  );
}
