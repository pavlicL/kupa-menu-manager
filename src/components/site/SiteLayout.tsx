import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/kvaka-logo.png.asset.json";

const nav = [
  { to: "/", label: "Početna" },
  { to: "/jelovnik", label: "Jelovnik" },
  { to: "/galerija", label: "Galerija" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-10">
            <Link to="/" aria-label="Restoran Kvaka – početna">
              <img src={logo.url} alt="Restoran Kvaka" className="h-10 w-auto md:h-12" />
            </Link>
            <nav className="hidden gap-7 font-condensed text-sm uppercase tracking-widest md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="border-b border-transparent pb-0.5 transition-colors hover:text-gold"
                  activeProps={{ className: "text-gold border-gold" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+38547000000"
              className="hidden bg-gold px-6 py-2 font-condensed text-sm uppercase tracking-widest text-gold-foreground transition-colors hover:bg-gold/90 md:inline-flex"
            >
              Rezerviraj stol
            </a>
            <button
              className="p-2 md:hidden"
              aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-4 border-t border-gold/20 px-6 py-5 font-condensed text-base uppercase tracking-widest md:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <a href="tel:+38547000000" className="text-gold">
              Rezerviraj stol
            </a>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-gold/10 bg-background px-6 py-14 text-center">
        <div className="mb-10 flex justify-center">
          <img src={logo.url} alt="Restoran Kvaka" className="h-20 w-auto" />
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 font-condensed text-sm uppercase tracking-widest md:grid-cols-3">
          <div>
            <h4 className="mb-3 text-gold">Lokacija</h4>
            <p>
              Obala rijeke Kupe
              <br />
              47000 Karlovac
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-gold">Radno vrijeme</h4>
            <p>
              Pon – Ned
              <br />
              10:00 – 23:00
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-gold">Kontakt</h4>
            <p>
              <a href="tel:+38547000000" className="hover:text-gold">
                +385 47 000 000
              </a>
              <br />
              <a href="mailto:info@restoran-kvaka.hr" className="hover:text-gold">
                info@restoran-kvaka.hr
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/40">
          <span>© {new Date().getFullYear()} Restoran Kvaka Karlovac. Sva prava pridržana.</span>
          <Link to="/prijava" className="hover:text-gold">
            Prijava za vlasnika
          </Link>
        </div>
      </footer>
    </div>
  );
}
