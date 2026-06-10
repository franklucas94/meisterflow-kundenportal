import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import FormDialog from "./FormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STATUS_LABELS = {
  entwurf: "Entwurf",
  gesendet: "Gesendet",
  akzeptiert: "Akzeptiert",
  abgelehnt: "Abgelehnt",
};

const PROJEKTSTATUS_LABELS = {
  geplant: "Geplant",
  in_bearbeitung: "In Bearbeitung",
  abgeschlossen: "Abgeschlossen",
};

export default function OfferteEditDialog({ offerte, open, onOpenChange }) {
  const [form, setForm] = useState(offerte || {});
  const qc = useQueryClient();

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Offerte.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offerten"] });
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (offerte) {
      setForm(offerte);
    }
  }, [offerte]);

  const handleSave = () => {
    update.mutate({ id: offerte.id, data: form });
  };

  return (
    <FormDialog
      title="Offerte bearbeiten"
      open={open}
      onOpenChange={onOpenChange}
      onSave={handleSave}
      isLoading={update.isPending}
    >
      <div className="space-y-4">
        <div>
          <Label>Status</Label>
          <Select value={form.status || "entwurf"} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gültig bis</Label>
          <Input
            type="date"
            value={form.gueltig_bis || ""}
            onChange={(e) => setForm({ ...form, gueltig_bis: e.target.value })}
          />
        </div>

        {form.status === "akzeptiert" && (
          <div>
            <Label>Projektstatus</Label>
            <Select value={form.projektstatus || "geplant"} onValueChange={(v) => setForm({ ...form, projektstatus: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJEKTSTATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Notiz (optional)</Label>
          <Textarea
            placeholder="Interne Notiz zu dieser Offerte..."
            value={form.notiz || ""}
            onChange={(e) => setForm({ ...form, notiz: e.target.value })}
            className="min-h-20"
          />
        </div>
      </div>
    </FormDialog>
  );
}