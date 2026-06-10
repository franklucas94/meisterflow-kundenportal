import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, RotateCcw, Loader2 } from "lucide-react";

export default function WebsitePreview({ url }) {
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef(null);

  // Use allorigins proxy to bypass X-Frame-Options
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  const handleReload = () => {
    setLoading(true);
    setBlocked(false);
    if (iframeRef.current) {
      iframeRef.current.src = proxyUrl;
    }
  };

  return (
    <div className="relative w-full bg-muted/10" style={{ height: "520px" }}>
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono border border-border">
          <Globe className="w-3 h-3 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
        <button
          onClick={handleReload}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Neu laden"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="In neuem Tab öffnen">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </a>
      </div>

      {/* Loading overlay */}
      {loading && !blocked && (
        <div className="absolute inset-0 top-10 flex items-center justify-center bg-background/80 z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Seite wird geladen…
          </div>
        </div>
      )}

      {/* Blocked fallback */}
      {blocked && (
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center gap-4 text-center p-8 bg-background z-10">
          <Globe className="w-12 h-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold text-foreground">Vorschau blockiert</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Diese Website erlaubt keine eingebettete Vorschau. Öffnen Sie sie direkt.
            </p>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="w-4 h-4" /> Website öffnen
            </Button>
          </a>
        </div>
      )}

      {/* iframe */}
      <iframe
        ref={iframeRef}
        src={proxyUrl}
        title="Website Vorschau"
        className="w-full border-none"
        style={{ height: "calc(100% - 42px)" }}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setBlocked(true); }}
      />
    </div>
  );
}