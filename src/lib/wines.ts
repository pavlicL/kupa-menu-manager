import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Wine = {
  id: string;
  category_id: string;
  name: string;
  bottle_size: string;
  bottle_price: number;
  glass_size: string | null;
  glass_price: number | null;
  sort_order: number;
  is_visible: boolean;
};
export type WineCategory = { id: string; name: string; sort_order: number; is_visible: boolean; wines: Wine[] };

export const winesQuery = queryOptions({
  queryKey: ["wines"],
  queryFn: async (): Promise<WineCategory[]> => {
    const [{ data: categories, error: categoryError }, { data: wines, error: wineError }] = await Promise.all([
      supabase.from("wine_categories").select("*").order("sort_order"),
      supabase.from("wines").select("*").order("sort_order"),
    ]);
    if (categoryError) throw categoryError;
    if (wineError) throw wineError;
    return (categories ?? []).map((category) => ({
      ...category,
      wines: (wines ?? []).filter((wine) => wine.category_id === category.id).map((wine) => ({
        ...wine,
        bottle_price: Number(wine.bottle_price),
        glass_price: wine.glass_price === null ? null : Number(wine.glass_price),
      })),
    }));
  },
  staleTime: 60_000,
});
