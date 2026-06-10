import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle, Copy, Bell, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const StatusZeile = ({ icon: Icon, label, aktiv }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
    <div className="flex items-center gap-2.5 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-foreground">{label}</span>
    </div>
    <span className={`flex items-center gap-1 text-xs font-medium ${aktiv ? "text-emerald-600" : "text-slate-400"}`}>
      {aktiv ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {aktiv ? "Aktiv" : "Nicht aktiv"}
    </span>
  </div>
);

export default function BewertungssystemKarte({ firma }) {
  const { toast } = useToast();
  const qc = useQueryClient();

  // We treat the system as active if the firm has google connected (simple proxy for now)
  const systemAktiv = !!firma?.google_verbunden;

  const updateFirma = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Firma.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["firma"] }),
  });

  const bewertungsLink = firma?.google_bewertungslink || "";

  const copyLink = () => {
    if (!bewertungsLink) return;
    navigator.clipboard.writeText(bewertungsLink);
    toast({ title: "Bewertungslink kopiert!" });
  };

  const toggleSystem = () => {
    if (!firma?.id) return;
    updateFirma.mutate({ id: firma.id, data: { google_verbunden: !systemAktiv } });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <h2 className="font-heading font-bold text-lg text-foreground">Bewertungssystem</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${systemAktiv ? "text-emerald-600" : "text-slate-400"}`}>
            {systemAktiv ? "Aktiv" : "Nicht aktiv"}
          </span>
          <Switch checked={systemAktiv} onCheckedChange={toggleSystem} />
        </div>
      </div>

      <div className="mb-5">
        <StatusZeile icon={Zap} label="Automatische Bewertungsanfragen" aktiv={systemAktiv} />
        <StatusZeile icon={Bell} label="Erinnerungen" aktiv={systemAktiv} />
      </div>

      <Button variant="outline" size="sm" onClick={copyLink} disabled={!bewertungsLink} className="w-full">
        <Copy className="w-4 h-4 mr-1.5" /> Bewertungslink kopieren
      </Button>
    </Card>
  );
}