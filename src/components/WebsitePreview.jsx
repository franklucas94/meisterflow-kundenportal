import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, RotateCcw, Loader2 } from "lucide-react";

export default function WebsitePreview({ url }) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  const handleReload = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  return (
    <div className="w-full" style={{ height: "520px" }}>
      {/* Browser-Chrome */}
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

      {/* Ladeindikator */}
      <div className="relative" style={{ height: "calc(520px - 42px)" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10 pointer-events-none">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Wird geladen…
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          title="Website Vorschau"
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}