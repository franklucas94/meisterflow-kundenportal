import React from "react";
import { Card } from "@/components/ui/card";
import GoogleSuchLink from "./GoogleSuchLink";
import { STATUS_CONFIG } from "./statusConfig";

export default function StatusTabelle({ titel, beschreibung, icon: Icon, eintraege }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <h3 className="font-heading font-bold text-sm">{titel}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{beschreibung}</p>
      {eintraege.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No entries yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {eintraege.map((e) => {
            const cfg = STATUS_CONFIG[e.status] || STATUS_CONFIG.geplant;
            return (
              <div key={e.id} className="flex items-center justify-between py-3 gap-3 flex-wrap">
                <span className="text-sm font-medium text-foreground">{e.name}</span>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${cfg.className}`}>
                    {cfg.emoji} {cfg.label}
                  </span>
                  <GoogleSuchLink suchbegriff={e.suchbegriff} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}