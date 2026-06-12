import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import IntegrationKarte from "@/components/onboarding/IntegrationKarte";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Star, Check, Sparkles, TrendingUp, Search } from "lucide-react";

export default function SchrittGoogle({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="Google verbinden" untertitel="Zugriff auf Google Unternehmensprofil, Bewertungen, Analytics und Search Console – alles über einen Klick." icon={Star} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>
      {/* ── Google Konto ── */}
      <IntegrationKarte name="Google Konto verbinden" beschreibung="Google Unternehmensprofil · Bewertungen · Analytics · Search Console – ein Login für alles" icon={<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6" />} verbunden={form.google_verbunden} selected={form.google_verbunden} onSelect={() => setForm({ ...form, google_verbunden: !form.google_verbunden })} />

      {form.google_verbunden && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>
          <div><p className="text-sm font-semibold text-blue-700">Google Konto vorgemerkt</p><p className="text-xs text-blue-600">Unser Team wird die Verbindung gemeinsam mit Ihnen einrichten.</p></div>
        </div>
      )}

      {/* ── Business Profil ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Google Business Profil</p>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div><p className="text-sm font-medium text-foreground">Google Business Profil vorhanden?</p><p className="text-xs text-muted-foreground">Ihr Unternehmen ist auf Google Maps gelistet</p></div>
            <Switch checked={!!form.google_business_vorhanden} onCheckedChange={(v) => setForm({ ...form, google_business_vorhanden: v })} />
          </div>
        </div>
        {form.google_business_vorhanden && (
          <>
            <div className="space-y-1.5"><Label>Business-Profil URL</Label><Input value={form.google_business_url} onChange={f("google_business_url")} placeholder="https://maps.google.com/?cid=…" /></div>
            <div className="space-y-1.5"><Label>Google Bewertungslink</Label>
              <Input value={form.google_bewertungslink} onChange={f("google_bewertungslink")} placeholder="https://g.page/r/…/review" />
              <p className="text-xs text-muted-foreground">Den Link finden Sie in Ihrem Google Business Profil unter «Bewertungen erhalten».</p>
            </div>
          </>
        )}
      </div>

      {/* ── Analytics & Search Console ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Search className="w-4 h-4" /> Analytics & Search Console</p>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {[
            { key: "google_analytics_oauth", label: "Google Analytics per OAuth", sub: "Traffic automatisch auslesen, Reports generieren, Leads messen" },
            { key: "google_search_console_oauth", label: "Google Search Console per OAuth", sub: "Rankings überwachen, SEO-Reports automatisch erstellen" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between p-4">
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              <Switch checked={!!form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: v })} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefit ── */}
      <div className="rounded-xl bg-muted/60 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Dadurch werden möglich:</p>
        <div className="grid grid-cols-2 gap-1">
          {["Google Unternehmensprofil", "Bewertungen lesen & antworten", "Analytics Daten & Reports", "Search Console & SEO", "Automatische Bewertungsanfragen", "KI-gestützte Antworten"].map((f) => (
            <p key={f} className="text-sm text-foreground flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary shrink-0" /> {f}</p>
          ))}
        </div>
      </div>
    </SchrittCard>
  );
}