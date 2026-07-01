import React from "react";
import { Card } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";
import GoogleSuchLink from "./GoogleSuchLink";

export default function NeuGefundenKarte({ eintraege }) {
  if (eintraege.length === 0) return null;
  return (
    <Card className="p-5 border-emerald-200 bg-emerald-50/40">
      <div className="flex items-center gap-2 mb-1">
        <PartyPopper className="w-4 h-4 text-emerald-600" />
        <h3 className="font-heading font-bold text-sm">Newly Found 🎉</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Your website was newly found for:</p>
      <ul className="space-y-2.5">
        {eintraege.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-3 text-sm flex-wrap">
            <span className="flex items-center gap-2 text-foreground font-medium">✅ {e.name}</span>
            <GoogleSuchLink suchbegriff={e.suchbegriff} />
          </li>
        ))}
      </ul>
    </Card>
  );
}