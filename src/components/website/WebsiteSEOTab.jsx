import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapPin, Wrench } from "lucide-react";
import StatusTabelle from "@/components/cockpit/StatusTabelle";
import AktuelleMassnahmenKarte from "@/components/cockpit/AktuelleMassnahmenKarte";
import NeuGefundenKarte from "@/components/cockpit/NeuGefundenKarte";
import FortschrittUebersicht from "@/components/cockpit/FortschrittUebersicht";
import NaechsteZieleKarte from "@/components/cockpit/NaechsteZieleKarte";

export default function WebsiteSEOTab({ firma }) {
  const { data: eintraege = [] } = useQuery({
    queryKey: ["sichtbarkeit", firma?.id],
    queryFn: () => base44.entities.SichtbarkeitsEintrag.filter({ firma_id: firma?.id }, "reihenfolge"),
    enabled: !!firma?.id,
  });

  const regionen = eintraege.filter((e) => e.typ === "region");
  const dienstleistungen = eintraege.filter((e) => e.typ === "dienstleistung");
  const massnahmen = eintraege.filter((e) => e.ist_aktuelle_massnahme);

  const dreissigTageAlt = new Date();
  dreissigTageAlt.setDate(dreissigTageAlt.getDate() - 30);
  const neuGefunden = eintraege.filter((e) => e.neu_gefunden_am && new Date(e.neu_gefunden_am) >= dreissigTageAlt);

  const diesenMonat = new Date().toISOString().slice(0, 7);
  const neuDiesenMonat = eintraege.filter((e) => (e.neu_gefunden_am || "").startsWith(diesenMonat)).length;

  const stats = [
    { label: "Regions Found", value: `${regionen.filter((r) => r.status === "gefunden").length} / ${regionen.length}` },
    { label: "Services Found", value: `${dienstleistungen.filter((d) => d.status === "gefunden").length} / ${dienstleistungen.length}` },
    { label: "Active Optimizations", value: eintraege.filter((e) => e.status === "im_aufbau").length },
    { label: "New This Month", value: neuDiesenMonat },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-1">Progress Cockpit</h3>
        <p className="text-sm text-muted-foreground">Your growth on Google – simple and clear.</p>
      </div>

      <FortschrittUebersicht stats={stats} />

      <div className="grid lg:grid-cols-2 gap-4">
        <StatusTabelle
          titel="Regions"
          icon={MapPin}
          beschreibung="See at a glance where your website is already visible and where we're currently expanding your reach."
          eintraege={regionen}
        />
        <StatusTabelle
          titel="Services"
          icon={Wrench}
          beschreibung="Track which services you're already found for on Google and what's optimized next."
          eintraege={dienstleistungen}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AktuelleMassnahmenKarte eintraege={massnahmen} />
        <NeuGefundenKarte eintraege={neuGefunden} />
      </div>

      <NaechsteZieleKarte
        regionen={regionen.filter((r) => r.status === "geplant")}
        dienstleistungen={dienstleistungen.filter((d) => d.status === "geplant")}
      />
    </div>
  );
}