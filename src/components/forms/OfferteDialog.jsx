import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormDialog from "./FormDialog";
import KundeSelect from "./KundeSelect";
import { format } from "date-fns";

const LEER = { titel: "", kunde_id: "", kunde_name: "", datum: format(new Date(), "yyyy-MM-dd"), betrag_einmalig: 0, betrag_monatlich: 0, status: "entwurf", leistungenText: "" };

export default function OfferteDialog({ open, onOpenChange, prefill = {} }) {
  const [form, setForm] = useState({ ...LEER, ...prefill });
  const qc = useQueryClient();

  const { data: offerten = [] } = useQuery({
    queryKey: ["offerten"],
    queryFn: () => base44.entities.Offerte.list("-created_date", 500),
  });

  useEffect(() => {
    if (open) setForm({ ...LEER, ...prefill });
  }, [open]);

  const create = useMutation({
    mutationFn: (f) => {
      const jahr = new Date().getFullYear();
      const nummer = `MF-${jahr}-${String(offerten.length + 1).padStart(4, "0")}`;
      const { leistungenText, ...rest } = f;
      return base44.entities.Offerte.create({
        ...rest,
        nummer,
        leistungen: leistungenText.split(",").map((s) => s.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offerten"] });
      setForm(LEER);
      onOpenChange(false);
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Neue Offerte"
      saving={create.isPending}
      onSubmit={() => create.mutate(form)}
    >
      <div className="space-y-1.5">
        <Label>Kunde</Label>
        <KundeSelect
          value={form.kunde_id}
          onChange={(kunde_id, kunde_name) => setForm({ ...form, kunde_id, kunde_name })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Titel</Label>
        <Input
          value={form.titel}
          onChange={(e) => setForm({ ...form, titel: e.target.value })}
          placeholder="z. B. Website-Paket Komplett"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Datum</Label>
          <Input
            type="date"
            value={form.datum}
            onChange={(e) => setForm({ ...form, datum: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Einmalig (CHF)</Label>
          <Input
            type="number"
            min="0"
            step="0.05"
            value={form.betrag_einmalig}
            onChange={(e) => setForm({ ...form, betrag_einmalig: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Monatlich (CHF)</Label>
          <Input
            type="number"
            min="0"
            step="0.05"
            value={form.betrag_monatlich}
            onChange={(e) => setForm({ ...form, betrag_monatlich: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Leistungen (durch Komma getrennt)</Label>
        <Input
          value={form.leistungenText}
          onChange={(e) => setForm({ ...form, leistungenText: e.target.value })}
          placeholder="z. B. Website Erstellung, SEO Basis, Hosting"
        />
      </div>
    </FormDialog>
  );
}