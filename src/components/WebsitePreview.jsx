import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, RefreshCw } from "lucide-react";

/**
 * Zeigt eine Website-Vorschau an.
 * Strategie:
 * 1. Versucht einen kostenlosen Screenshot-Dienst (thum.io)
 * 2. Fallback: iframe (funktioniert wenn kein X-Frame-Options gesetzt)
 * 3. Letzter Fallback: Link-Karte
 */
export default function WebsitePreview({ url }) {
  const [mode, setMode] = useState("screenshot"); // "screenshot" | "iframe" | "fallback"

  const screenshotUrl = `https://image.thum.io/get/width/1280/crop/800/${url}`;

  if (mode === "screenshot") {
    return (
      <div className="relative w-full bg-muted/20" style={{ height: "480px" }}>
        <img
          src={screenshotUrl}
          alt="Website Vorschau"
          className="w-full h-full object-cover object-top"
          onError={() => setMode("iframe")}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 shadow text-xs opacity-80 hover:opacity-100"
            onClick={() => setMode("iframe")}
          >
            <RefreshCw className="w-3 h-3" /> Als iFrame laden
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "iframe") {
    return (
      <div className="relative w-full" style={{ height: "480px" }}>
        <iframe
          src={url}
          title="Website Vorschau"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onError={() => setMode("fallback")}
        />
        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 shadow text-xs opacity-80 hover:opacity-100"
            onClick={() => setMode("fallback")}
          >
            Vorschau nicht ladbar?
          </Button>
        </div>
      </div>
    );
  }

  // Fallback: Karte mit Link
  return (
    <div className="w-full flex items-center justify-center flex-col gap-4 text-center p-12 bg-muted/20" style={{ height: "480px" }}>
      <Globe className="w-14 h-14 text-muted-foreground/40" />
      <div>
        <p className="font-semibold text-foreground text-lg">Vorschau nicht verfügbar</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Diese Website erlaubt keine eingebettete Vorschau. Öffnen Sie sie direkt im Browser.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setMode("screenshot")}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> Erneut versuchen
        </Button>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button className="gap-2">
            <ExternalLink className="w-4 h-4" /> Website öffnen
          </Button>
        </a>
      </div>
    </div>
  );
}