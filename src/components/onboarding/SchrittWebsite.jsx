import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Server, Lock } from "lucide-react";

const CMS_OPTIONEN = [
  { id: "wordpress", label: "WordPress" },
  { id: "wix", label: "Wix" },
  { id: "webflow", label: "Webflow" },
  { id: "shopify", label: "Shopify" },
  { id: "joomla", label: "Joomla" },
  { id: "typo3", label: "Typo3" },
  { id: "andere", label: "Andere" },
];

export default function SchrittWebsite({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="Website & Zugänge" untertitel="Damit unser Team Ihre Website übernehmen kann, benötigen wir Zugang zu Domain, Hosting und CMS." icon={Globe} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>
      {/* ── Domain ── */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Globe className="w-4 h-4" /> Domain</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Domain</Label><Input value={form.domain} onChange={f("domain")} placeholder="www.meinefirma.ch" /></div>
          <div className="space-y-1.5"><Label>Domain-Registrar</Label><Input value={form.domain_registrar} onChange={f("domain_registrar")} placeholder="Hostpoint, Infomaniak, IONOS…" /></div>
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div><p className="text-sm font-medium text-foreground">Zugang delegieren</p><p className="text-xs text-muted-foreground">Ich erteile MeisterFlow Zugriff auf die Domain-Verwaltung</p></div>
            <Switch checked={!!form.domain_zugang_delegiert} onCheckedChange={(v) => setForm({ ...form, domain_zugang_delegiert: v })} />
          </div>
        </div>
        {!form.domain_zugang_delegiert && (
          <div className="space-y-1.5"><Label>Domain Login-E-Mail</Label><Input value={form.domain_zugang_login} onChange={f("domain_zugang_login")} placeholder="admin@meinefirma.ch" /></div>
        )}
      </div>

      {/* ── Hosting ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Server className="w-4 h-4" /> Hosting</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Hosting-Anbieter</Label><Input value={form.hosting_anbieter} onChange={f("hosting_anbieter")} placeholder="Hostpoint, Infomaniak, IONOS…" /></div>
          <div className="space-y-1.5"><Label>Login URL</Label><Input value={form.hosting_login_url} onChange={f("hosting_login_url")} placeholder="https://admin.hostpoint.ch" /></div>
        </div>
        <div className="space-y-1.5"><Label>Benutzername</Label><Input value={form.hosting_benutzername} onChange={f("hosting_benutzername")} /></div>
      </div>

      {/* ── CMS ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Website-CMS</p>
        <div className="space-y-2">
          <Label>Welches CMS nutzt Ihre Website?</Label>
          <div className="flex flex-wrap gap-2">
            {CMS_OPTIONEN.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setForm({ ...form, cms_typ: form.cms_typ === opt.id ? "" : opt.id })} className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${form.cms_typ === opt.id ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {form.cms_typ && form.cms_typ !== "andere" && (
          <>
            <div className="space-y-1.5"><Label>CMS Admin URL</Label><Input value={form.cms_admin_url} onChange={f("cms_admin_url")} placeholder={form.cms_typ === "wordpress" ? "https://meinefirma.ch/wp-admin" : "CMS Login URL"} /></div>
            <div className="space-y-1.5"><Label>CMS Benutzername</Label><Input value={form.cms_benutzername} onChange={f("cms_benutzername")} /></div>
          </>
        )}

        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {[
            { key: "hat_website", label: "Bestehende Website vorhanden", sub: "Sie haben bereits eine aktive Website" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between p-4">
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              <Switch checked={!!form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: v })} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Zugangsdaten speichern ── */}
      <div className="rounded-xl border border-primary/30 bg-accent p-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Zugangsdaten verschlüsselt speichern?</p>
              <p className="text-xs text-muted-foreground">MeisterFlow kann Domain, Hosting und CMS zentral verwalten. Alle Daten werden sicher verschlüsselt.</p>
            </div>
          </div>
          <Switch checked={!!form.zugangsdaten_speichern} onCheckedChange={(v) => setForm({ ...form, zugangsdaten_speichern: v })} />
        </div>
      </div>
    </SchrittCard>
  );
}