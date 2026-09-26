import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SeasonalNews = { id: string; title: string; body: string | null; image_url: string | null; sort_order: number; is_visible: boolean };
export const seasonalQuery = queryOptions({
  queryKey: ["seasonal-news"],
  queryFn: async (): Promise<SeasonalNews[]> => {
    const { data, error } = await supabase.from("seasonal_news").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 60_000,
});
