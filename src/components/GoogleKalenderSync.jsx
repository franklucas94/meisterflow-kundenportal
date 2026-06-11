import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function GoogleKalenderSync() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check by attempting a harmless list call via the backend
    base44.functions.invoke("syncTerminToGoogleCalendar", {
      action: "ping",
      termin: null,
    })
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${connected ? "bg-emerald-50 border-emerald-200" : "bg-muted/40 border-border"}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
        alt="Google Calendar"
        className="w-6 h-6 object-contain flex-shrink-0"
      />
      <div>
        <p className="text-sm font-semibold">Google Kalender</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {loading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /><span className="text-xs text-muted-foreground">Prüfe Verbindung…</span></>
          ) : connected ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span className="text-xs text-emerald-700 font-medium">Verbunden — neue Termine werden automatisch synchronisiert</span></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Nicht verbunden — bitte Google Kalender in den App-Einstellungen autorisieren</span></>
          )}
        </div>
      </div>
    </div>
  );
}