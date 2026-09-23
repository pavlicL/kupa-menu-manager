import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  unit: string;
  price: number;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
  items: MenuItem[];
};

export async function fetchMenu(): Promise<MenuCategory[]> {
  const [{ data: cats, error: e1 }, { data: items, error: e2 }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return (cats ?? []).map((c) => ({
    ...c,
    items: (items ?? [])
      .filter((i) => i.category_id === c.id)
      .map((i) => ({ ...i, price: Number(i.price) })),
  }));
}

export const menuQuery = queryOptions({
  queryKey: ["menu"],
  queryFn: fetchMenu,
  staleTime: 60_000,
});

export function formatPrice(price: number) {
  return `${price.toFixed(2).replace(".", ",")} €`;
}
