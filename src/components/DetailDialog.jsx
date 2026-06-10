import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { formatDatum, formatCHF } from "@/lib/format";
import { CalendarDays, MapPin, Clock, FileText, Star, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";

function Zeile({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground col-span-1">{label}</span>
      <span className="text-sm text-foreground col-span-2 font-medium">{value}</span>
    </div>
  );
}

export function AnfrageDetailDialog({ anfrage, open, onOpenChange }) {
  if (!anfrage) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {anfrage.betreff}
            <StatusBadge status={anfrage.status} />
          </DialogTitle>
        </DialogHeader>
        <div>
          <Zeile label="Herkunft" value={anfrage.herkunft} />
          <Zeile label="Beschreibung" value={anfrage.beschreibung} />
          <Zeile label="Nachfassung" value={anfrage.nachfassung_datum ? formatDatum(anfrage.nachfassung_datum) : null} />
          <Zeile label="Notizen" value={anfrage.notizen} />
          <Zeile label="Erstellt am" value={formatDatum(anfrage.created_date)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TerminDetailDialog({ termin, open, onOpenChange }) {
  if (!termin) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {termin.titel}
            <StatusBadge status={termin.status} />
          </DialogTitle>
        </DialogHeader>
        <div>
          <Zeile label="Datum" value={formatDatum(termin.datum)} />
          <Zeile label="Uhrzeit" value={termin.uhrzeit} />
          <Zeile label="Dauer" value={termin.dauer_minuten ? `${termin.dauer_minuten} Min.` : null} />
          <Zeile label="Ort" value={termin.ort} />
          <Zeile label="Notizen" value={termin.notizen} />
          <Zeile label="Erinnerung" value={termin.erinnerung ? "Ja" : "Nein"} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OfferteDetailDialog({ offerte, open, onOpenChange }) {
  const { toast } = useToast();

  const generatePDF = (off) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(24);
    doc.text("OFFERTE", 20, y);
    y += 15;

    doc.setFontSize(10);
    doc.text(`Offertennummer: ${off.nummer}`, 20, y);
    y += 5;
    doc.text(`Datum: ${formatDatum(off.datum)}`, 20, y);
    if (off.gueltig_bis) {
      y += 5;
      doc.text(`Gültig bis: ${formatDatum(off.gueltig_bis)}`, 20, y);
    }
    y += 12;

    doc.setFontSize(11);
    doc.text("Kunde:", 20, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(off.kunde_name || "-", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(off.titel || "-", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.text("Enthaltene Leistungen:", 20, y);
    y += 5;
    off.leistungen?.forEach((l) => {
      doc.text(`• ${l}`, 25, y);
      y += 5;
    });
    y += 5;

    doc.setFontSize(11);
    doc.text("Preisübersicht:", 20, y);
    y += 5;
    doc.setFontSize(10);
    if (off.betrag_einmalig) {
      doc.text(`Einmalig: CHF ${off.betrag_einmalig.toFixed(2)}`, 25, y);
      y += 5;
    }
    if (off.betrag_monatlich) {
      doc.text(`Monatlich: CHF ${off.betrag_monatlich.toFixed(2)}`, 25, y);
      y += 5;
    }
    const total = (off.betrag_einmalig || 0) + (off.betrag_monatlich || 0);
    doc.setFontSize(11);
    doc.text(`Total: CHF ${total.toFixed(2)}`, 25, y);

    y += 12;
    doc.setFontSize(10);
    const statusLabels = { entwurf: "Entwurf", gesendet: "Gesendet", akzeptiert: "Akzeptiert", abgelehnt: "Abgelehnt" };
    doc.text(`Status: ${statusLabels[off.status] || off.status}`, 20, y);

    return doc;
  };

  const openPDF = () => {
    const doc = generatePDF(offerte);
    window.open(doc.output("bloburi"), "_blank");
  };

  const downloadPDF = () => {
    const doc = generatePDF(offerte);
    doc.save(`Offerte-${offerte.nummer}.pdf`);
    toast({ title: "PDF heruntergeladen" });
  };

  if (!offerte) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {offerte.nummer} – {offerte.titel}
            <StatusBadge status={offerte.status} />
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button type="button" variant="outline" size="sm" onClick={openPDF} className="flex-1">
            <FileText className="w-4 h-4 mr-1.5" /> Öffnen
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadPDF} className="flex-1">
            <Download className="w-4 h-4 mr-1.5" /> Download
          </Button>
        </div>
        <div>
          <Zeile label="Datum" value={formatDatum(offerte.datum)} />
          {offerte.gueltig_bis && <Zeile label="Gültig bis" value={formatDatum(offerte.gueltig_bis)} />}
          <Zeile label="Einmalig" value={formatCHF(offerte.betrag_einmalig)} />
          <Zeile label="Monatlich" value={formatCHF(offerte.betrag_monatlich)} />
          {offerte.leistungen?.length > 0 && (
            <div className="py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Leistungen</span>
              <ul className="mt-1 space-y-1">
                {offerte.leistungen.map((l, i) => (
                  <li key={i} className="text-sm text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {offerte.notiz && <Zeile label="Notiz" value={offerte.notiz} />}
          <Zeile label="Erstellt am" value={formatDatum(offerte.created_date)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RechnungDetailDialog({ rechnung, open, onOpenChange }) {
  if (!rechnung) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {rechnung.nummer} – {rechnung.titel}
            <StatusBadge status={rechnung.status} />
          </DialogTitle>
        </DialogHeader>
        <div>
          <Zeile label="Datum" value={formatDatum(rechnung.datum)} />
          <Zeile label="Fällig am" value={formatDatum(rechnung.faellig_am)} />
          <Zeile label="Betrag" value={formatCHF(rechnung.betrag)} />
          <Zeile label="Automatisch" value={rechnung.automatisch ? "Ja" : "Nein"} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BewertungDetailDialog({ bewertung, open, onOpenChange }) {
  if (!bewertung) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bewertung
            <StatusBadge status={bewertung.status} />
          </DialogTitle>
        </DialogHeader>
        <div>
          <Zeile label="Typ" value={bewertung.typ === "google" ? "Google Bewertung" : "Internes Feedback"} />
          {bewertung.sterne > 0 && (
            <div className="py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Sterne</span>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-5 h-5 ${i <= bewertung.sterne ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
            </div>
          )}
          <Zeile label="Kommentar" value={bewertung.kommentar} />
          <Zeile label="Erstellt am" value={formatDatum(bewertung.created_date)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}