import React, { useRef } from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Building2, Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

const DIENSTLEISTUNGEN_VORGABEN = [
  "Dachdecker", "Maler", "Elektriker", "Sanitär/Heizung", "Gartenbau",
  "Reinigungsfirma", "Schreiner/Zimmermann", "Bauunternehmen", "Umzugsunternehmen",
  "Fenster & Türen", "Fliesen & Böden", "Küchenbau", "Haushaltgeräte", "IT-Dienstleister",
];

export default function SchrittFirma({ form, setForm, saving, onWeiter, onZurueck }) {
  const logoInputRef = useRef(null);
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  const toggleDienstleistung = (dl) => {
    const list = form.dienstleistungen || [];
    setForm({ ...form, dienstleistungen: list.includes(dl) ? list.filter((x) => x !== dl) : [...list, dl] });
  };

  const eigeneHinzufuegen = () => {
    const dl = (form.eigene_dienstleistung || "").trim();
    if (!dl || form.dienstleistungen?.includes(dl)) return;
    setForm({ ...form, dienstleistungen: [...(form.dienstleistungen || []), dl], eigene_dienstleistung: "" });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, _logoFile: file, _logoPreview: URL.createObjectURL(file) });
  };

  const handleWeiter = async () => {
    const logoFile = form._logoFile;
    let logo_url = form.logo_url || "";
    if (logoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: logoFile });
      logo_url = file_url;
    }
    const data = { ...form, logo_url };
    delete data._logoFile;
    delete data._logoPreview;
    delete data.eigene_dienstleistung;
    onWeiter(data);
  };

  return (
    <SchrittCard titel="Firmendaten & Rechnungsdaten" untertitel="Diese Daten werden für Offerten, Rechnungen und Ihr Kundenportal verwendet." icon={Building2} weiterDisabled={!form.firmenname} saving={saving} onWeiter={handleWeiter} onZurueck={onZurueck}>
      {/* ── Basis Firmendaten ── */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Firmendaten</p>
        <div className="space-y-1.5">
          <Label>Firmenname *</Label>
          <Input value={form.firmenname} onChange={f("firmenname")} placeholder="z. B. Malerbetrieb Huber AG" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Ansprechpartner</Label>
            <Input value={form.ansprechpartner} onChange={f("ansprechpartner")} placeholder="Vorname Nachname" />
          </div>
          <div className="space-y-1.5">
            <Label>Telefon</Label>
            <Input value={form.telefon} onChange={f("telefon")} placeholder="+41 44 123 45 67" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>E-Mail</Label>
          <Input type="email" value={form.email} onChange={f("email")} placeholder="info@meinefirma.ch" />
        </div>
        <div className="space-y-1.5">
          <Label>Adresse</Label>
          <Input value={form.adresse} onChange={f("adresse")} placeholder="Musterstrasse 1" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5"><Label>PLZ</Label><Input value={form.plz} onChange={f("plz")} /></div>
          <div className="col-span-2 space-y-1.5"><Label>Ort</Label><Input value={form.ort} onChange={f("ort")} /></div>
        </div>
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

      {/* ── Logo ── */}
      <div className="space-y-2">
        <Label>Firmenlogo</Label>
        <div onClick={() => logoInputRef.current?.click()} className={cn("border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors", form._logoPreview || form.logo_url ? "border-primary/40 bg-accent" : "border-border hover:border-primary/50 hover:bg-accent/50")}>
          {form._logoPreview || form.logo_url ? (
            <img src={form._logoPreview || form.logo_url} alt="Logo" className="max-h-20 max-w-xs object-contain" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"><Upload className="w-5 h-5 text-muted-foreground" /></div>
              <div className="text-center"><p className="text-sm font-medium text-foreground">Logo hochladen</p><p className="text-xs text-muted-foreground">PNG, JPG oder SVG · max. 2 MB</p></div>
            </>
          )}
        </div>
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        {(form._logoPreview || form.logo_url) && (
          <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, _logoFile: null, _logoPreview: null, logo_url: "" })}>
            <X className="w-3.5 h-3.5 mr-1" /> Logo entfernen
          </Button>
        )}
      </div>

      {/* ── Dienstleistungen ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dienstleistungen</p>
        <div className="flex flex-wrap gap-2">
          {DIENSTLEISTUNGEN_VORGABEN.map((dl) => {
            const aktiv = form.dienstleistungen?.includes(dl);
            return (
              <button key={dl} type="button" onClick={() => toggleDienstleistung(dl)} className={cn("px-3.5 py-2 rounded-full text-sm font-medium border transition-all", aktiv ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent")}>
                {aktiv && <Check className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={3} />}{dl}
              </button>
            );
          })}
        </div>
        {form.dienstleistungen?.filter((d) => !DIENSTLEISTUNGEN_VORGABEN.includes(d)).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.dienstleistungen.filter((d) => !DIENSTLEISTUNGEN_VORGABEN.includes(d)).map((dl) => (
              <span key={dl} className="px-3.5 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground border border-primary flex items-center gap-2">
                {dl}<button type="button" onClick={() => toggleDienstleistung(dl)}><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input value={form.eigene_dienstleistung || ""} onChange={(e) => setForm({ ...form, eigene_dienstleistung: e.target.value })} placeholder="Eigene Dienstleistung hinzufügen…" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), eigeneHinzufuegen())} />
          <Button type="button" variant="outline" onClick={eigeneHinzufuegen}>Hinzufügen</Button>
        </div>
      </div>
    </SchrittCard>
  );
}