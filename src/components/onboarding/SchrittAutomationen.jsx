import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Switch } from "@/components/ui/switch";
import { Zap, Check } from "lucide-react";

const AUTOMATIONEN = [
  { key: "automation_termine", label: "Terminbestätigung", sub: "Kunden automatisch per E-Mail/WhatsApp bestätigen" },
  { key: "automation_erinnerungen", label: "Terminerinnerung", sub: "Automatische Erinnerung 24h vor Termin" },
  { key: "automation_offerte_nachfassen", label: "Offerte nachfassen", sub: "Automatisch nach 5 Tagen nachfassen" },
  { key: "automation_rechnung_erinnerung", label: "Rechnungserinnerung", sub: "Erinnerung vor und nach Fälligkeit" },
  { key: "automation_bewertungsanfrage", label: "Bewertungsanfrage", sub: "Nach Auftrag automatisch Bewertung anfordern" },
  { key: "automation_wiederkehrend", label: "Wiederkehrende Rechnungen", sub: "Monatliche/jährliche Rechnungen automatisch erstellen" },
  { key: "automation_whatsapp", label: "WhatsApp Benachrichtigungen", sub: "Termine & Offerten auch per WhatsApp senden" },
];

export default function SchrittAutomationen({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const alleAktiv = AUTOMATIONEN.every((a) => form[a.key]);
  const toggleAlle = () => {
    const updates = {};
    AUTOMATIONEN.forEach((a) => { updates[a.key] = !alleAktiv; });
    setForm({ ...form, ...updates });
  };

  return (
    <SchrittCard titel="Automationen" untertitel="Welche Automationen sollen für Sie aktiv sein? Alles automatisch – Sie sparen Zeit." icon={Zap} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Automationen auswählen</p>
        <button type="button" onClick={toggleAlle} className="text-xs font-medium text-primary hover:underline">{alleAktiv ? "Alle deaktivieren" : "Alle aktivieren"}</button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {AUTOMATIONEN.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between p-4">
            <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
            <Switch checked={!!form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: v })} />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted/60 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Ihre Auswahl</p>
        <div className="grid grid-cols-2 gap-1">
          {AUTOMATIONEN.map(({ key, label }) => (
            form[key] ? <p key={key} className="text-sm text-emerald-700 font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /> {label}</p> : null
          ))}
          {!AUTOMATIONEN.some((a) => form[a.key]) && <p className="text-sm text-muted-foreground col-span-2">Keine Automationen ausgewählt – können später aktiviert werden.</p>}
        </div>
      </div>
    </SchrittCard>
  );
}