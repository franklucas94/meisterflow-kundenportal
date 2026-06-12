import React, { useRef } from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Button } from "@/components/ui/button";
import { Upload, Check, X, FileText, Shield, FileImage, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

export default function SchrittDateien({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const bilderInputRef = useRef(null);
  const broschuerenInputRef = useRef(null);
  const zertifikateInputRef = useRef(null);

  const uploadSingle = async (file, key) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, [key]: file_url, [`_${key}_preview`]: file.name });
  };

  const uploadMultiple = async (files, key) => {
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm({ ...form, [key]: [...(form[key] || []), ...urls] });
  };

  const handleSingleUpload = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadSingle(file, key);
  };

  const handleMultiUpload = (key) => (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    uploadMultiple(files, key);
  };

  const removeUrl = (key, index) => {
    const list = form[key] || [];
    setForm({ ...form, [key]: list.filter((_, i) => i !== index) });
  };

  const removeSingle = (key) => {
    setForm({ ...form, [key]: "", [`_${key}_preview`]: "" });
  };

  return (
    <SchrittCard titel="Dateien & Übergabe" untertitel="Laden Sie wichtige Dokumente hoch – das spart später extrem viel Zeit." icon={FolderOpen} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} weiterText="Einrichtung abschliessen" onWeiter={() => onWeiter()}>

      {/* ── Firmenbilder ── */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><FileImage className="w-4 h-4" /> Firmenbilder</p>
        <div onClick={() => bilderInputRef.current?.click()} className={cn("border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors", "border-border hover:border-primary/50 hover:bg-accent/50")}>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"><Upload className="w-5 h-5 text-muted-foreground" /></div>
          <div className="text-center"><p className="text-sm font-medium text-foreground">Firmenbilder hochladen</p><p className="text-xs text-muted-foreground">Referenzbilder, Teamfotos, Fahrzeuge – mehrere möglich</p></div>
        </div>
        <input ref={bilderInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleMultiUpload("firma_bilder_urls")} />
        {(form.firma_bilder_urls || []).map((url, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bild {i + 1} hochgeladen <button onClick={() => removeUrl("firma_bilder_urls", i)}><X className="w-3.5 h-3.5 text-red-400 hover:text-red-600" /></button></div>
        ))}
      </div>

      {/* ── Dokumente ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><FileText className="w-4 h-4" /> Dokumente</p>

        {[
          { key: "agb_url", label: "AGB", icon: FileText, sub: "Allgemeine Geschäftsbedingungen" },
          { key: "datenschutz_url", label: "Datenschutzerklärung", icon: Shield, sub: "DSGVO-konforme Erklärung" },
          { key: "preisliste_url", label: "Preisliste", icon: FileText, sub: "Aktuelle Preisliste / Tarife" },
        ].map(({ key, label, icon: Icon, sub }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
            </div>
            {form[key] ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600"><Check className="w-3.5 h-3.5" /> Hochgeladen <button onClick={() => removeSingle(key)}><X className="w-3.5 h-3.5 text-red-400" /></button></div>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.doc,.docx,.txt";
                input.onchange = (e) => { if (e.target.files[0]) uploadSingle(e.target.files[0], key); };
                input.click();
              }}>
                <Upload className="w-3.5 h-3.5 mr-1" /> Hochladen
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* ── Broschüren ── */}
      <div className="space-y-2 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Broschüren & Zertifikate</p>
        {[
          { key: "broschuere_urls", label: "Broschüren", ref: broschuerenInputRef, handler: handleMultiUpload("broschuere_urls") },
          { key: "zertifikate_urls", label: "Zertifikate", ref: zertifikateInputRef, handler: handleMultiUpload("zertifikate_urls") },
        ].map(({ key, label, ref, handler }) => (
          <div key={key}>
            <div onClick={() => ref.current?.click()} className={cn("border-2 border-dashed rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors", "border-border hover:border-primary/50 hover:bg-accent/50")}>
              <Upload className="w-4 h-4 text-muted-foreground" />
              <div><p className="text-sm font-medium text-foreground">{label} hochladen</p><p className="text-xs text-muted-foreground">PDF, PNG, JPG</p></div>
            </div>
            <input ref={ref} type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" onChange={handler} />
            {(form[key] || []).map((url, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> {label.slice(0, -1)} {i + 1} <button onClick={() => removeUrl(key, i)}><X className="w-3.5 h-3.5 text-red-400" /></button></div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Zusammenfassung ── */}
      <div className="rounded-xl bg-muted/60 p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">Alles bereit! 🎉</p>
        <p className="text-sm text-muted-foreground">Nach dem Abschluss wird Ihr MeisterFlow Kundenportal vollständig eingerichtet. Sie können alle Angaben jederzeit unter <strong>Einstellungen → Firma</strong> anpassen.</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            form.firmenname && "Firmendaten ✓",
            form.kalender_verbunden && "Kalender ✓",
            form.google_verbunden && "Google ✓",
            form.email_verbunden && "E-Mail ✓",
            form.whatsapp_verbunden && "WhatsApp ✓",
            form.stripe_verbunden && "Stripe ✓",
            form.dienstleistungen?.length > 0 && `${form.dienstleistungen.length} Dienstleistungen ✓`,
            AUTOMATION_KEYS.filter(k => form[k]).length > 0 && `${AUTOMATION_KEYS.filter(k => form[k]).length} Automationen ✓`,
          ].filter(Boolean).map((item) => (
            <p key={item} className="text-sm text-emerald-700 font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /> {item}</p>
          ))}
        </div>
      </div>
    </SchrittCard>
  );
}