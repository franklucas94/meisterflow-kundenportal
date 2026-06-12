import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Brain, Clock, MapPin, AlertTriangle } from "lucide-react";

export default function SchrittBetrieb({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="KI & Betrieb" untertitel="Diese Informationen nutzt der KI-Assistent, um Ihre Kunden optimal zu betreuen." icon={Brain} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>

      {/* ── Unternehmensbeschreibung ── */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Über Ihr Unternehmen</p>
        <div className="space-y-1.5">
          <Label>Was bieten Sie an? (Unternehmensbeschreibung)</Label>
          <Textarea value={form.unternehmensbeschreibung} onChange={f("unternehmensbeschreibung")} className="h-20" placeholder="Beschreiben Sie kurz Ihre Dienstleistungen und was Sie von anderen unterscheidet…" />
        </div>
        <div className="space-y-1.5">
          <Label>Wie läuft ein Auftrag typischerweise ab?</Label>
          <Textarea value={form.auftragsablauf} onChange={f("auftragsablauf")} className="h-20" placeholder="z. B. Erstkontakt → Besichtigung → Offerte → Ausführung → Abnahme → Rechnung…" />
        </div>
      </div>

      {/* ── Regionen ── */}
      <div className="space-y-1.5 pt-2">
        <Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> Welche Regionen bedienen Sie?</Label>
        <Input value={form.regionen} onChange={f("regionen")} placeholder="z. B. Kanton Zürich, Aargau, Zentralschweiz…" />
      </div>

      {/* ── Öffnungszeiten ── */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> Öffnungszeiten</Label>
        <Input value={form.oeffnungszeiten} onChange={f("oeffnungszeiten")} placeholder="z. B. Mo–Fr 07:00–17:00, Sa nach Vereinbarung" />
      </div>

      {/* ── Notfallservice ── */}
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div><p className="text-sm font-medium text-foreground">Notfallservice</p><p className="text-xs text-muted-foreground">Bieten Sie einen 24/7 Notfallservice an?</p></div>
          </div>
          <Switch checked={!!form.notfallservice} onCheckedChange={(v) => setForm({ ...form, notfallservice: v })} />
        </div>
      </div>

      {/* ── Mitarbeiter ── */}
      <div className="space-y-1.5 pt-2">
        <Label>Anzahl Mitarbeiter</Label>
        <Input type="number" value={form.mitarbeiter_anzahl || 1} onChange={(e) => setForm({ ...form, mitarbeiter_anzahl: parseInt(e.target.value) || 1 })} />
      </div>

      <div className="rounded-xl bg-muted/60 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Diese Daten helfen dem KI-Assistenten bei:</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Automatische Kundenanfragen beantworten</li>
          <li>• Passende Termine vorschlagen</li>
          <li>• Regionale Verfügbarkeit prüfen</li>
          <li>• Notfall-Anfragen priorisieren</li>
        </ul>
      </div>
    </SchrittCard>
  );
}