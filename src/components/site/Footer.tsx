import { Link } from "@tanstack/react-router";
import { Instagram, MapPin } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/cart";
import teamPulseLogo from "@/assets/TeamPulse.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img
            src={teamPulseLogo}
            alt="TeamPulse"
            className="h-9 w-auto select-none"
            draggable={false}
          />
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
            Marketplace y comunidad TCG para duelistas del Noroeste Argentino. Cartas, accesorios y
            torneos.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
          >
            <WhatsAppIcon className="h-4 w-4" /> +54 9 381 352-1194
          </a>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/60">
            Explorar
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-gold">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-gold">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/noticias" className="hover:text-gold">
                Noticias & Artículos
              </Link>
            </li>
            <li>
              <Link to="/meta" className="hover:text-gold">
                Meta
              </Link>
            </li>
            <li>
              <Link to="/kaiba-labs" className="hover:text-gold">
                Kaiba Labs
              </Link>
            </li>
            <li>
              <Link to="/carrito" className="hover:text-gold">
                Carrito
              </Link>
            </li>
            <li>
              <Link to="/como-comprar" className="hover:text-gold">
                Cómo comprar
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/60">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Tucumán, NOA
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4" /> @duelist.noa
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-primary-foreground/60 sm:flex-row sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
            <div>© {new Date().getFullYear()}</div>
            <a
              href="https://www.behance.net/guguehh"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary-foreground/70 hover:text-primary-foreground"
            >
              Made with love by Gugueh
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.11 17.53c-.24-.12-1.39-.69-1.61-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.39-.57 1.59-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z" />
      <path d="M26.67 15.91c0 5.89-4.79 10.68-10.68 10.68-1.88 0-3.72-.49-5.34-1.42l-4.16 1.09 1.11-4.06a10.63 10.63 0 0 1-1.6-5.68c0-5.89 4.79-10.68 10.68-10.68 5.89 0 10.68 4.79 10.68 10.68zm-10.68-8.83c-4.87 0-8.83 3.96-8.83 8.83 0 1.86.58 3.65 1.68 5.15l.15.21-.66 2.43 2.49-.65.2.12c1.45.86 3.12 1.31 4.98 1.31 4.87 0 8.83-3.96 8.83-8.83 0-4.87-3.96-8.83-8.83-8.83z" />
    </svg>
  );
}
