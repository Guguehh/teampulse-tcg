import { Copy, Facebook, Share2, Twitter } from "lucide-react";
import { shareLink, type ShareTarget } from "@/lib/admin/share";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShareMenu({ url, text }: { url: string; text?: string }) {
  const action = (target: ShareTarget) => shareLink(target, url, text);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="secondary">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => action("copy")}>
          <Copy /> Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => action("whatsapp")}>
          <WhatsAppIcon /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => action("x")}>
          <Twitter /> Twitter/X
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => action("facebook")}>
          <Facebook /> Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M19.11 17.53c-.24-.12-1.39-.69-1.61-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.39-.57 1.59-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z" />
      <path d="M26.67 15.91c0 5.89-4.79 10.68-10.68 10.68-1.88 0-3.72-.49-5.34-1.42l-4.16 1.09 1.11-4.06a10.63 10.63 0 0 1-1.6-5.68c0-5.89 4.79-10.68 10.68-10.68 5.89 0 10.68 4.79 10.68 10.68zm-10.68-8.83c-4.87 0-8.83 3.96-8.83 8.83 0 1.86.58 3.65 1.68 5.15l.15.21-.66 2.43 2.49-.65.2.12c1.45.86 3.12 1.31 4.98 1.31 4.87 0 8.83-3.96 8.83-8.83 0-4.87-3.96-8.83-8.83-8.83z" />
    </svg>
  );
}
