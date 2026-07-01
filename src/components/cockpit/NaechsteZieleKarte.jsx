import React from "react";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function NaechsteZieleKarte({ regionen, dienstleistungen }) {
  if (regionen.length === 0 && dienstleistungen.length === 0) return null;
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-bold text-sm">Next Goals</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">We're focusing on these next.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {regionen.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Regions</p>
            <ul className="space-y-1.5">
              {regionen.map((r) => (
                <li key={r.id} className="text-sm text-foreground">📍 {r.name}</li>
              ))}
            </ul>
          </div>
        )}
        {dienstleistungen.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Services</p>
            <ul className="space-y-1.5">
              {dienstleistungen.map((d) => (
                <li key={d.id} className="text-sm text-foreground">🛠 {d.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}