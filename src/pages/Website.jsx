import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import WebsitePreview from "@/components/WebsitePreview";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Globe, ExternalLink, Send, Upload, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TYP_LABELS = {
  anpassung: "Anpassung",
  neues_element: "Neues Element",
  fehler: "Fehler melden",
  sonstiges: "Sonstiges",
};

const PRIO_LABELS = {
  niedrig: "Niedrig",
  mittel: "Mittel",
  hoch: "Hoch",
};

export default function Website() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ titel: "", beschreibung: "", typ: "anpassung", prioritaet: "mittel" });
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: firmen = [] } = useQuery({
    queryKey: ["firma", user?.id],
    queryFn: () => base44.entities.Firma.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const firma = firmen[0];

  const { data: anfragen = [] } = useQuery({
    queryKey: ["website-anfragen"],
    queryFn: () => base44.entities.WebsiteAnfrage.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const erstellen = useMutation({
    mutationFn: (data) => base44.entities.WebsiteAnfrage.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website-anfragen"] });
      setDialogOpen(false);
      setForm({ titel: "", beschreibung: "", typ: "anpassung", prioritaet: "mittel" });
      setScreenshotFile(null);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let screenshot_url = "";
    if (screenshotFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: screenshotFile });
      screenshot_url = file_url;
    }
    erstellen.mutate({ ...form, screenshot_url, user_id: user?.id, firma_id: firma?.id });
    setUploading(false);
  };

  const websiteUrl = firma?.domain
    ? firma.domain.startsWith("http") ? firma.domain : `https://${firma.domain}`
    : null;

  const statusIcon = (status) => {
    if (status === "erledigt") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === "in_bearbeitung") return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === "abgelehnt") return <AlertCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div>
      <PageHeader title="Website" subtitle="Ihre Website verwalten und Anpassungen anfragen">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Anpassung anfragen
        </Button>
      </PageHeader>

      {/* Website Vorschau */}
      {websiteUrl ? (
        <Card className="mb-8 overflow-hidden">
          <WebsitePreview url={websiteUrl} />
        </Card>
      ) : (
        <Card className="mb-8 p-10 text-center">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">Keine Website hinterlegt</p>
          <p className="text-sm text-muted-foreground mt-1">
            Hinterlegen Sie Ihre Domain unter <strong>Firma → Einstellungen</strong>
          </p>
        </Card>
      )}

      {/* Anfragen Liste */}
      <div>
        <h2 className="font-heading font-bold text-lg mb-4">Meine Anfragen</h2>
        {anfragen.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground text-sm">
            Noch keine Anfragen gestellt.
          </Card>
        ) : (
          <div className="space-y-3">
            {anfragen.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">{statusIcon(a.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{a.titel}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground font-medium">
                        {TYP_LABELS[a.typ] || a.typ}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        a.prioritaet === "hoch" ? "bg-red-50 text-red-600" :
                        a.prioritaet === "mittel" ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {PRIO_LABELS[a.prioritaet]}
                      </span>
                    </div>
                    {a.beschreibung && (
                      <p className="text-sm text-muted-foreground mt-1">{a.beschreibung}</p>
                    )}
                    {a.screenshot_url && (
                      <a href={a.screenshot_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-block">
                        Screenshot ansehen
                      </a>
                    )}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog: Neue Anfrage */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Website-Anpassung anfragen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Titel *</Label>
              <Input
                value={form.titel}
                onChange={(e) => setForm({ ...form, titel: e.target.value })}
                placeholder="z. B. Kontaktformular anpassen"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Art der Anfrage</Label>
                <Select value={form.typ} onValueChange={(v) => setForm({ ...form, typ: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYP_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priorität</Label>
                <Select value={form.prioritaet} onValueChange={(v) => setForm({ ...form, prioritaet: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIO_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Beschreibung</Label>
              <Textarea
                value={form.beschreibung}
                onChange={(e) => setForm({ ...form, beschreibung: e.target.value })}
                placeholder="Beschreiben Sie die gewünschte Anpassung möglichst genau…"
                className="h-28"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Screenshot (optional)</Label>
              {screenshotFile ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/40">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{screenshotFile.name}</span>
                  <button type="button" onClick={() => setScreenshotFile(null)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Screenshot hochladen</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setScreenshotFile(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button type="submit" disabled={!form.titel || uploading || erstellen.isPending}>
                <Send className="w-4 h-4 mr-1.5" />
                {uploading || erstellen.isPending ? "Wird gesendet…" : "Anfrage senden"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}