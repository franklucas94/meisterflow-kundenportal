import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function FortschrittUebersicht({ stats }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-bold text-sm">Your Progress</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-heading font-extrabold text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}