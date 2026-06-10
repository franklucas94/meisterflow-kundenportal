import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import TerminDialog from "@/components/forms/TerminDialog";
import { Plus, Building2, MapPin, Clock, Bell, BellOff, Trash2 } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { de } from "date-fns/locale";

const STATUS_LABELS = {
  geplant: "Geplant",
  bestaetigt: "Bestätigt",
  abgeschlossen: "Abgeschlossen",
  abgesagt: "Abgesagt",
};

function datumTitel(d) {
  const date = new Date(d);
  if (isToday(date)) return "Heute";
  if (isTomorrow(date)) return "Morgen";
  return format(date, "EEEE, dd. MMMM yyyy", { locale: de });
}

export default function Termine() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const { data: termine = [] } = useQuery({
    queryKey: ["termine"],
    queryFn: () => base44.entities.Termin.list("-created_date", 500),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Termin.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["termine"] }),
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities.Termin.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["termine"] }),
  });

  const sortiert = [...termine].sort((a, b) =>
    `${a.datum} ${a.uhrzeit || ""}`.localeCompare(`${b.datum} ${b.uhrzeit || ""}`)
  );

  const gruppen = sortiert.reduce((acc, t) => {
    (acc[t.datum] = acc[t.datum] || []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Termine" subtitle={`${termine.length} Termine im Kalender`}>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Neuer Termin
        </Button>
      </PageHeader>

      <div className="space-y-7">
        {termine.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground text-sm">
            Noch keine Termine geplant.
          </Card>
        )}
        {Object.entries(gruppen).map(([datum, eintraege]) => (
          <div key={datum}>
            <h2 className="font-heading font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
              {datumTitel(datum)}
            </h2>
            <div className="space-y-3">
              {eintraege.map((t) => (
                <Card key={t.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-14 shrink-0 text-center">
                        <div className="font-heading font-extrabold text-foreground">
                          {t.uhrzeit || "–"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.dauer_minuten ? `${t.dauer_minuten} Min.` : ""}
                        </div>
                      </div>
                      <div className="w-px self-stretch bg-border" />
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold text-foreground">{t.titel}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {t.kunde_name && (
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" /> {t.kunde_name}
                            </span>
                          )}
                          {t.ort && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> {t.ort}
                            </span>
                          )}
                        </div>
                        {t.notizen && (
                          <p className="text-xs text-muted-foreground">{t.notizen}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t.erinnerung ? "Erinnerung aktiv" : "Keine Erinnerung"}
                        className={t.erinnerung ? "text-primary" : "text-muted-foreground"}
                        onClick={() => update.mutate({ id: t.id, data: { erinnerung: !t.erinnerung } })}
                      >
                        {t.erinnerung ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </Button>
                      <Select
                        value={t.status}
                        onValueChange={(status) => update.mutate({ id: t.id, data: { status } })}
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
                        onClick={() => remove.mutate(t.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TerminDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}