import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import IntegrationKarte from "@/components/onboarding/IntegrationKarte";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wallet, Check, CreditCard, Smartphone, Banknote } from "lucide-react";

const ZAHLUNGSMETHODEN = [
  { key: "twint_aktiv", label: "TWINT", icon: Smartphone, sub: "Schweizer Mobile Payment" },
  { key: "kreditkarten_aktiv", label: "Kreditkarten", icon: CreditCard, sub: "Visa, Mastercard, Amex" },
  { key: "apple_pay_aktiv", label: "Apple Pay", icon: Wallet, sub: "Für iPhone Nutzer" },
  { key: "google_pay_aktiv", label: "Google Pay", icon: Wallet, sub: "Für Android Nutzer" },
  { key: "rechnung_zahlung", label: "Rechnung", icon: Banknote, sub: "Zahlung per Rechnung" },
  { key: "bar_zahlung", label: "Bar", icon: Banknote, sub: "Barzahlung vor Ort" },
];

export default function SchrittZahlungen({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="Zahlungen" untertitel="Richten Sie Zahlungen ein – für Rechnungen, QR-Codes und Ihr Kundenportal." icon={Wallet} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>

      {/* ── Stripe ── */}
      <IntegrationKarte name="Stripe verbinden" beschreibung="Online-Zahlungen · QR-Rechnungen · Tap to Pay · Kundenportal" icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="w-6 h-6 object-contain" />} verbunden={form.stripe_verbunden} selected={form.stripe_verbunden} onSelect={() => setForm({ ...form, stripe_verbunden: !form.stripe_verbunden })} />

      {form.stripe_verbunden && (
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Stripe Zahlungslink</Label><Input value={form.stripe_zahlungslink} onChange={f("stripe_zahlungslink")} placeholder="https://buy.stripe.com/…" /></div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>
            <div><p className="text-sm font-semibold text-blue-700">Stripe vorgemerkt</p><p className="text-xs text-blue-600">Unser Team richtet die Zahlungsanbindung gemeinsam mit Ihnen ein.</p></div>
          </div>
        </div>
      )}

      {/* ── Zahlungsmethoden ── */}
      <div className="space-y-2 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Welche Zahlungen möchten Sie akzeptieren?</p>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {ZAHLUNGSMETHODEN.map(({ key, label, icon: Icon, sub }) => (
            <div key={key} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              </div>
              <Switch checked={!!form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: v })} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted/60 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Mit aktivierten Zahlungen können Sie:</p>
        <div className="grid grid-cols-2 gap-1">
          {["Rechnungen online bezahlen", "QR-Rechnungen erstellen", "Tap to Pay nutzen", "Kundenportal Zahlungen", "Automatische Zahlungslinks", "Twint integrieren"].map((f) => (
            <p key={f} className="text-sm text-foreground flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} /> {f}</p>
          ))}
        </div>
      </div>
    </SchrittCard>
  );
}