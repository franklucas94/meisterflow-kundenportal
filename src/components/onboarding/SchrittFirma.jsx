import React, { useRef } from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

export default function SchrittFirma({ form, setForm, saving, onWeiter, onZurueck }) {
  const logoInputRef = useRef(null);
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  const eigeneHinzufuegen = () => {
    const dl = (form.eigene_dienstleistung || "").trim();
    if (!dl || form.dienstleistungen?.includes(dl)) return;
    setForm({ ...form, dienstleistungen: [...(form.dienstleistungen || []), dl], eigene_dienstleistung: "" });
  };

  const dienstleistungEntfernen = (dl) => {
    setForm({ ...form, dienstleistungen: (form.dienstleistungen || []).filter((x) => x !== dl) });
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
    <SchrittCard titel="Firma" untertitel="Diese Daten werden für Offerten, Rechnungen und Ihr Kundenportal verwendet." icon={Building2} weiterDisabled={!form.firmenname} saving={saving} onWeiter={handleWeiter} onZurueck={onZurueck}>
      {/* ── Firmendaten ── */}
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
        {(form.dienstleistungen || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.dienstleistungen.map((dl) => (
              <span key={dl} className="px-3.5 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground border border-primary flex items-center gap-2">
                {dl}<button type="button" onClick={() => dienstleistungEntfernen(dl)}><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input value={form.eigene_dienstleistung || ""} onChange={(e) => setForm({ ...form, eigene_dienstleistung: e.target.value })} placeholder="Dienstleistung hinzufügen…" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), eigeneHinzufuegen())} />
          <Button type="button" variant="outline" onClick={eigeneHinzufuegen}>Hinzufügen</Button>
        </div>
      </div>
    </SchrittCard>
  );
}