import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Wallet, CreditCard, Smartphone, Banknote, ExternalLink } from "lucide-react";

const ZAHLUNGSMETHODEN = [
  { key: "kreditkarten_aktiv", label: "Kreditkarten", icon: CreditCard, sub: "Visa, Mastercard, Amex" },
  { key: "apple_pay_aktiv", label: "Apple Pay", icon: Wallet, sub: "Für iPhone Nutzer" },
  { key: "google_pay_aktiv", label: "Google Pay", icon: Wallet, sub: "Für Android Nutzer" },
  { key: "rechnung_zahlung", label: "Rechnung", icon: Banknote, sub: "Zahlung per Rechnung" },
  { key: "bar_zahlung", label: "Bar", icon: Banknote, sub: "Barzahlung vor Ort" },
];

export default function SchrittZahlungen({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="Zahlungen (Optional)" untertitel="Richten Sie Zahlungen ein – für Rechnungen, QR-Codes und Ihr Kundenportal." icon={Wallet} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>
      {/* ── Stripe ── */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Stripe (Online-Zahlungen)</p>
        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="w-10 h-10 object-contain mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Stripe Konto erstellen</p>
              <p className="text-xs text-muted-foreground">Unser Team richtet die Zahlungsanbindung gemeinsam mit Ihnen ein.</p>
            </div>
          </div>
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ExternalLink className="w-4 h-4" /> Stripe Konto erstellen
          </a>
          {form.stripe_verbunden && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <Label>Stripe Zahlungslink</Label>
              <Input value={form.stripe_zahlungslink} onChange={f("stripe_zahlungslink")} placeholder="https://buy.stripe.com/…" />
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div><p className="text-sm font-medium text-foreground">Stripe aktivieren</p><p className="text-xs text-muted-foreground">Vormerken für Einrichtung durch unser Team</p></div>
            <Switch checked={!!form.stripe_verbunden} onCheckedChange={(v) => setForm({ ...form, stripe_verbunden: v })} />
          </div>
        </div>
      </div>

      {/* ── TWINT ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">TWINT</p>
        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Smartphone className="w-6 h-6 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">TWINT Geschäftskonto</p>
              <p className="text-xs text-muted-foreground">Unser Team richtet die TWINT-Anbindung gemeinsam mit Ihnen ein.</p>
            </div>
          </div>
          <a href="https://www.twint.ch/geschaeftskunden/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ExternalLink className="w-4 h-4" /> TWINT Geschäftskonto erstellen
          </a>
          {form.twint_aktiv && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <Label>TWINT Zahlungslink</Label>
              <Input value={form.twint_zahlungslink || ""} onChange={f("twint_zahlungslink")} placeholder="https://pay.twint.ch/…" />
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div><p className="text-sm font-medium text-foreground">TWINT aktivieren</p><p className="text-xs text-muted-foreground">Vormerken für Einrichtung durch unser Team</p></div>
            <Switch checked={!!form.twint_aktiv} onCheckedChange={(v) => setForm({ ...form, twint_aktiv: v })} />
          </div>
        </div>
      </div>

      {/* ── Gebührenhinweis ── */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Zahlungsabwicklung – Konditionen</p>
        <p className="text-xs text-amber-700">TWINT, Stripe und MeisterFlow Zahlungsabwicklung: Gebühr 0.5% pro Transaktion.</p>
      </div>

      {/* ── Rechnungsdaten ── */}
      <div className="space-y-4 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Rechnungsdaten</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>UID / MWST Nummer</Label>
            <Input value={form.uid_nummer} onChange={f("uid_nummer")} placeholder="CHE-123.456.789" />
          </div>
          <div className="space-y-1.5">
            <Label>MWST Nummer</Label>
            <Input value={form.mwst_nummer} onChange={f("mwst_nummer")} placeholder="CHE-123.456.789 MWST" />
          </div>
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div><p className="text-sm font-medium text-foreground">MWST pflichtig</p><p className="text-xs text-muted-foreground">Mehrwertsteuer auf Rechnungen ausweisen</p></div>
            <Switch checked={!!form.mwst_pflichtig} onCheckedChange={(v) => setForm({ ...form, mwst_pflichtig: v })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Zahlungsfrist (Tage)</Label>
          <Input type="number" value={form.zahlungsfrist_tage || 30} onChange={(e) => setForm({ ...form, zahlungsfrist_tage: parseInt(e.target.value) || 30 })} />
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div><p className="text-sm font-medium text-foreground">QR-Rechnung aktivieren</p><p className="text-xs text-muted-foreground">Schweizer QR-Rechnung für einfache Zahlungen</p></div>
            <Switch checked={!!form.qr_rechnung} onCheckedChange={(v) => setForm({ ...form, qr_rechnung: v })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>IBAN</Label>
          <Input value={form.iban} onChange={f("iban")} placeholder="CHXX XXXX XXXX XXXX XXXX X" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Bankname</Label><Input value={form.bankname} onChange={f("bankname")} placeholder="z. B. UBS, ZKB" /></div>
          <div className="space-y-1.5"><Label>Kontoinhaber</Label><Input value={form.kontoinhaber} onChange={f("kontoinhaber")} /></div>
        </div>
        <div className="space-y-1.5">
          <Label>Rechnungsadresse (falls abweichend)</Label>
          <Textarea value={form.rechnungsadresse} onChange={f("rechnungsadresse")} className="h-16" placeholder="Nur ausfüllen wenn abweichend von der Firmenadresse" />
        </div>
      </div>

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
    </SchrittCard>
  );
}