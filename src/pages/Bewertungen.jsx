import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import BewertungDialog from "@/components/forms/BewertungDialog";
import { formatDatum } from "@/lib/format";
import { Plus, Star, Building2, Trash2 } from "lucide-react";

const STATUS_LABELS = { angefragt: "Angefragt", erhalten: "Erhalten", beantwortet: "Beantwortet" };

function Sterne({ anzahl }) {
  if (!anzahl) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= anzahl ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function Bewertungen() {
  const [typFilter, setTypFilter] = useState("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const { data: bewertungen = [] } = useQuery({
    queryKey: ["bewertungen"],
    queryFn: () => base44.entities.Bewertung.list("-created_date", 500),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bewertung.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bewertungen"] }),
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities.Bewertung.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bewertungen"] }),
  });

  const filtered = typFilter === "alle" ? bewertungen : bewertungen.filter((b) => b.typ === typFilter);

  const erhaltene = bewertungen.filter((b) => b.sterne);
  const durchschnitt = erhaltene.length
    ? (erhaltene.reduce((s, b) => s + b.sterne, 0) / erhaltene.length).toFixed(1)
    : "–";

  return (
    <div>
      <PageHeader
        title="Bewertungen"
        subtitle={`${bewertungen.length} Bewertungen · Durchschnitt ${durchschnitt} ★`}
      >
        <Select value={typFilter} onValueChange={setTypFilter}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Typen</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="intern">Internes Feedback</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Bewertungsanfrage
        </Button>
      </PageHeader>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground text-sm">
            Keine Bewertungen gefunden.
          </Card>
        )}
        {filtered.map((b) => (
          <Card key={b.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Sterne anzahl={b.sterne} />
                  <StatusBadge status={b.status} />
                  <Badge variant="outline" className="font-normal">
                    {b.typ === "google" ? "Google Bewertung" : "Internes Feedback"}
                  </Badge>
                </div>
                {b.kunde_name && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" /> {b.kunde_name}
                  </div>
                )}
                {b.kommentar && (
                  <p className="text-sm text-foreground italic">«{b.kommentar}»</p>
                )}
                <p className="text-xs text-muted-foreground">{formatDatum(b.created_date)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Select
                  value={b.status}
                  onValueChange={(status) => update.mutate({ id: b.id, data: { status } })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => remove.mutate(b.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BewertungDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}