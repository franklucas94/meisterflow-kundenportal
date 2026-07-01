import React from "react";
import { Search } from "lucide-react";

export default function GoogleSuchLink({ suchbegriff, label = "View on Google" }) {
  if (!suchbegriff) return <span className="text-muted-foreground text-xs">–</span>;
  const url = `https://www.google.com/search?q=${encodeURIComponent(suchbegriff)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline whitespace-nowrap"
    >
      <Search className="w-3.5 h-3.5" /> {label}
    </a>
  );
}