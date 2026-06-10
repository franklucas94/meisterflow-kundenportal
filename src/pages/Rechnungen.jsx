import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import RechnungDialog from "@/components/forms/RechnungDialog";
import { formatCHF, formatDatum } from "@/lib/format";
import { Plus, Building2, CalendarDays, Trash2, Zap } from "lucide-react";

const STATUS_LABELS = {
  offen: "Offen",
  bezahlt: "Bezahlt",
  ueberfaellig: "Überfällig",
  storniert: "Storniert",
};

export default function Rechnungen() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const { data: rechnungen = [] } = useQuery({
    queryKey: ["rechnungen"],
    queryFn: () => base44.entities.Rechnung.list("-created_date", 500),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Rechnung.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rechnungen"] }),
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities.Rechnung.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rechnungen"] }),
  });

  const filtered = statusFilter === "alle" ? rechnungen : rechnungen.filter((r) => r.status === statusFilter);
  const offenerBetrag = rechnungen
    .filter((r) => ["offen", "ueberfaellig"].includes(r.status))
    .reduce((s, r) => s + (r.betrag || 0), 0);

  return (
    <div>
      <PageHeader
        title="Rechnungen"
        subtitle={`${rechnungen.length} Rechnungen · ${formatCHF(offenerBetrag)} offen`}
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => navigate("/rechnungen/erstellen")}>
          <Plus className="w-4 h-4 mr-1.5" /> Neue Rechnung
        </Button>
      </PageHeader>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground text-sm">Keine Rechnungen gefunden.</Card>
        )}
        {filtered.map((r) => (
          <Card key={r.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm text-muted-foreground">{r.nummer}</span>
                  <StatusBadge status={r.status} />
                  {r.automatisch && (
                    <Badge variant="outline" className="font-normal text-primary border-primary/30">
                      <Zap className="w-3 h-3 mr-1" /> Automatisch erstellt
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {r.kunde_name || r.titel}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> {formatDatum(r.datum)}
                  </span>
                  <span>Fällig am {formatDatum(r.faellig_am)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-heading font-extrabold text-lg text-foreground">
                  {formatCHF(r.betrag)}
                </span>
                <Select
                  value={r.status}
                  onValueChange={(status) => update.mutate({ id: r.id, data: { status } })}
                >
                  <SelectTrigger className="w-36">
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
                  onClick={() => remove.mutate(r.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RechnungDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}