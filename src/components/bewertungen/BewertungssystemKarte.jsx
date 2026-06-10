import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle, Copy, Bell, Zap, Send, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FeatureKachel = ({ icon: Icon, titel, beschreibung, aktiv }) => (
  <div className={`rounded-xl p-4 border transition-colors ${
    aktiv ? "bg-emerald-50 border-emerald-100" : "bg-muted/50 border-border"
  }`}>
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        aktiv ? "bg-emerald-100" : "bg-muted"
      }`}>
        <Icon className={`w-4 h-4 ${aktiv ? "text-emerald-600" : "text-muted-foreground"}`} />
      </div>
      <span className={`flex items-center gap-1 text-xs font-medium mt-0.5 ${
        aktiv ? "text-emerald-600" : "text-slate-400"
      }`}>
        {aktiv ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {aktiv ? "Aktiv" : "Inaktiv"}
      </span>
    </div>
    <div className="text-sm font-semibold text-foreground">{titel}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{beschreibung}</div>
  </div>
);

export default function BewertungssystemKarte({ firma, onAnfordern }) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const systemAktiv = !!firma?.google_verbunden;
  const bewertungsLink = firma?.google_bewertungslink || "";

  const updateFirma = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Firma.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["firma"] }),
  });

  const toggleSystem = () => {
    if (!firma?.id) return;
    updateFirma.mutate({ id: firma.id, data: { google_verbunden: !systemAktiv } });
  };

  const copyLink = () => {
    if (!bewertungsLink) return;
    navigator.clipboard.writeText(bewertungsLink);
    toast({ title: "Bewertungslink kopiert!" });
  };

  return (
    <Card className="overflow-hidden">
      {/* Status-Banner */}
      <div className={`px-6 py-4 flex items-center justify-between ${
        systemAktiv
          ? "bg-emerald-50 border-b border-emerald-100"
          : "bg-slate-50 border-b border-border"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${systemAktiv ? "bg-emerald-500 shadow-sm shadow-emerald-300" : "bg-slate-300"}`} />
          <div>
            <span className="font-heading font-bold text-foreground">Bewertungssystem</span>
            <span className={`ml-2 text-sm font-medium ${systemAktiv ? "text-emerald-600" : "text-slate-400"}`}>
              {systemAktiv ? "läuft" : "deaktiviert"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{systemAktiv ? "Aktiv" : "Inaktiv"}</span>
          <Switch checked={systemAktiv} onCheckedChange={toggleSystem} />
        </div>
      </div>

      {/* Feature-Kacheln */}
      <div className="p-6 grid grid-cols-2 gap-3 mb-2">
        <FeatureKachel
          icon={Zap}
          titel="Auto-Anfragen"
          beschreibung="Nach jedem Auftrag automatisch anfragen"
          aktiv={systemAktiv}
        />
        <FeatureKachel
          icon={Bell}
          titel="Erinnerungen"
          beschreibung="Nachfassen bei ausbleibender Antwort"
          aktiv={systemAktiv}
        />
      </div>

      {/* Aktionen */}
      <div className="px-6 pb-6 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={copyLink} disabled={!bewertungsLink}>
          <Copy className="w-4 h-4 mr-1.5" /> Link kopieren
        </Button>
        {onAnfordern && (
          <Button size="sm" className="flex-1" onClick={onAnfordern}>
            <Send className="w-4 h-4 mr-1.5" /> Anfrage senden
          </Button>
        )}
      </div>
    </Card>
  );
}