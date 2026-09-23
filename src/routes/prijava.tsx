import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/useAuth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "Prijava za vlasnika – Restoran Kvaka";

export const Route = createFileRoute("/prijava")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Prijava za uređivanje jelovnika Restorana Kvaka." },
      { property: "og:title", content: title },
      { property: "og:description", content: "Prijava za uređivanje jelovnika Restorana Kvaka." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrijavaPage,
});

function PrijavaPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else toast.success("Provjerite e-mail i potvrdite registraciju.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Prijava nije uspjela.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Prijava putem Googlea nije uspjela.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-20">
        <p className="eyebrow mb-3 text-gold">Vlasnik</p>
        <h1 className="font-serif text-4xl">{mode === "login" ? "Prijava" : "Registracija"}</h1>
        <p className="mt-3 text-sm text-foreground/70">
          Prijavite se za uređivanje jelovnika. Pristup uređivanju ima samo račun vlasnika.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gold py-3 font-condensed text-base uppercase tracking-widest text-gold-foreground transition-colors hover:bg-gold/90 disabled:opacity-60"
          >
            {busy ? "Trenutak…" : mode === "login" ? "Prijavi se" : "Registriraj se"}
          </button>
        </form>

        <button
          type="button"
          onClick={google}
          className="mt-4 w-full border border-border bg-card py-3 font-condensed text-base uppercase tracking-widest transition-colors hover:bg-accent"
        >
          Nastavi s Googleom
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-8 block w-full text-center text-sm text-foreground/60 underline-offset-4 hover:text-gold hover:underline"
        >
          {mode === "login" ? "Nemate račun? Registrirajte se" : "Već imate račun? Prijavite se"}
        </button>
      </section>
    </SiteLayout>
  );
}
