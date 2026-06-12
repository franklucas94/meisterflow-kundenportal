import React from "react";
import SchrittCard from "@/components/onboarding/SchrittCard";
import IntegrationKarte from "@/components/onboarding/IntegrationKarte";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CalendarDays, MessageCircle, Check, Sparkles } from "lucide-react";

export default function SchrittKommunikation({ form, setForm, saving, onWeiter, onZurueck, onUeberspringen }) {
  const f = (k) => (e) => setForm({ ...form, [k]: typeof e === "boolean" ? e : e.target?.value ?? e });

  return (
    <SchrittCard titel="Kommunikation" untertitel="E-Mail, Kalender und WhatsApp verbinden – für automatische Kommunikation mit Ihren Kunden." icon={Mail} saving={saving} ueberspringen onUeberspringen={onUeberspringen} onZurueck={onZurueck} onWeiter={() => onWeiter()}>

      {/* ── E-Mail ── */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Mail className="w-4 h-4" /> E-Mail</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: "microsoft365", name: "Microsoft 365", beschreibung: "Office 365, Exchange", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/The_OFFICIAL_Outlookcom_Logo.png" alt="M365" className="w-6 h-6 object-contain" /> },
            { id: "outlook", name: "Outlook", beschreibung: "Outlook Desktop & Web", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook" className="w-6 h-6 object-contain" /> },
            { id: "gmail", name: "Gmail", beschreibung: "Google Mail, Google Workspace", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-6 h-6 object-contain" /> },
            { id: "imap_smtp", name: "IMAP / SMTP", beschreibung: "Andere E-Mail-Anbieter", icon: <Mail className="w-6 h-6 text-muted-foreground" /> },
          ].map((opt) => (
            <IntegrationKarte key={opt.id} name={opt.name} beschreibung={opt.beschreibung} icon={opt.icon} verbunden={form.email_verbunden === opt.id} selected={form.email_verbunden === opt.id} onSelect={() => setForm({ ...form, email_verbunden: form.email_verbunden === opt.id ? "" : opt.id })} />
          ))}
        </div>
        {form.email_verbunden && (
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Haupt-E-Mail-Adresse</Label><Input type="email" value={form.email_verbunden_adresse} onChange={f("email_verbunden_adresse")} placeholder="info@meinefirma.ch" /></div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>
              <div><p className="text-sm font-semibold text-blue-700">E-Mail vorgemerkt</p><p className="text-xs text-blue-600">Unser Team richtet die E-Mail-Anbindung gemeinsam mit Ihnen ein.</p></div>
            </div>
          </div>
        )}
      </div>

      {/* ── Kalender ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Kalender</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: "google", name: "Google Kalender", beschreibung: "Gmail, Google Workspace", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" },
            { id: "microsoft365", name: "Microsoft 365", beschreibung: "Office 365, Teams", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/The_OFFICIAL_Outlookcom_Logo.png" },
            { id: "outlook", name: "Microsoft Outlook", beschreibung: "Outlook Desktop & Web", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" },
            { id: "apple", name: "Apple Kalender", beschreibung: "iCloud, iPhone, iPad", icon: "https://upload.wikimedia.org/wikipedia/commons/3/37/Apple_Calendar_Icon.png", bald: true },
          ].map((opt) => (
            <IntegrationKarte key={opt.id} name={opt.name} beschreibung={opt.beschreibung} icon={<img src={opt.icon} alt={opt.name} className="w-6 h-6 object-contain" />} bald={opt.bald} verbunden={form.kalender_verbunden === opt.id} selected={form.kalender_verbunden === opt.id} onSelect={() => setForm({ ...form, kalender_verbunden: form.kalender_verbunden === opt.id ? "" : opt.id })} />
          ))}
        </div>
        {form.kalender_verbunden && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>
            <div><p className="text-sm font-semibold text-blue-700">Kalender vorgemerkt</p><p className="text-xs text-blue-600">Unser Team wird die Verbindung gemeinsam mit Ihnen einrichten.</p></div>
          </div>
        )}
        <div className="rounded-xl bg-muted/60 p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Nach der Verbindung kann MeisterFlow:</p>
          <ul className="space-y-1">
            {["Termine erstellen", "Termine verschieben", "Erinnerungen senden", "Verfügbarkeiten abrufen"].map((f) => (
              <li key={f} className="text-sm text-foreground flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} /> {f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── WhatsApp ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</p>
        <IntegrationKarte name="WhatsApp Business" beschreibung="Terminbestätigungen · Offerten · Erinnerungen · Nachfassungen" icon={<MessageCircle className="w-6 h-6 text-emerald-600" />} verbunden={form.whatsapp_verbunden} selected={form.whatsapp_verbunden} onSelect={() => setForm({ ...form, whatsapp_verbunden: !form.whatsapp_verbunden })} />
        {form.whatsapp_verbunden && (
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>WhatsApp Business Nummer</Label><Input value={form.whatsapp_nummer} onChange={f("whatsapp_nummer")} placeholder="+41 79 123 45 67" /></div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>
              <div><p className="text-sm font-semibold text-emerald-700">WhatsApp Business verbunden</p><p className="text-xs text-emerald-600">Nachrichten werden automatisch über Ihre Business-Nummer gesendet.</p></div>
            </div>
          </div>
        )}
        <div className="rounded-xl bg-muted/60 p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Wird später verwendet für:</p>
          <ul className="space-y-1">
            {["Terminbestätigungen", "Offerten versenden", "Erinnerungen", "Automatische Nachfassungen"].map((item) => (
              <li key={item} className="text-sm text-foreground flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} /> {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </SchrittCard>
  );
}