import React from "react";
import { Card } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function AktuelleMassnahmenKarte({ eintraege }) {
  if (eintraege.length === 0) return null;
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <Rocket className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-bold text-sm">Currently Working On</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Our current optimizations for your business.</p>
      <ul className="space-y-2.5">
        {eintraege.map((e) => (
          <li key={e.id} className="flex items-center gap-2.5 text-sm text-foreground">
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            {e.massnahme_text || e.name}
          </li>
        ))}
      </ul>
    </Card>
  );
}