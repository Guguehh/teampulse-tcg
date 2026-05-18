export type ShareTarget = "copy" | "whatsapp" | "x" | "facebook";

export async function shareLink(target: ShareTarget, url: string, text?: string) {
  if (target === "copy") {
    await navigator.clipboard.writeText(url);
    return;
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text ?? "");

  const shareUrl =
    target === "whatsapp"
      ? `https://wa.me/?text=${encodedText ? `${encodedText}%20${encodedUrl}` : encodedUrl}`
      : target === "x"
        ? `https://twitter.com/intent/tweet?url=${encodedUrl}${encodedText ? `&text=${encodedText}` : ""}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  window.open(shareUrl, "_blank", "noopener,noreferrer");
}
