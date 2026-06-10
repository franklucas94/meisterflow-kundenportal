import jsPDF from "jspdf";
import { formatDatum, formatCHF } from "@/lib/format";

const COLORS = {
  primary: [44, 123, 229],
  dark: [30, 41, 59],
  light: [226, 232, 240],
  border: [203, 213, 225],
};

export function generateProfessionalOfferte(offerte, firma) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Header mit Logo
  if (firma?.logo_url) {
    try {
      doc.addImage(firma.logo_url, "JPEG", margin, y, 30, 30);
    } catch (e) {
      console.log("Logo konnte nicht geladen werden");
    }
  }

  // Firmeninformationen rechts
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.dark);
  const headerRightX = pageWidth - margin - 80;
  let headerY = y;

  if (firma?.firmenname) {
    doc.setFont(undefined, "bold");
    doc.text(firma.firmenname, headerRightX, headerY);
    headerY += 5;
  }

  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);

  if (firma?.adresse) doc.text(firma.adresse, headerRightX, headerY), (headerY += 3);
  if (firma?.plz && firma?.ort) doc.text(`${firma.plz} ${firma.ort}`, headerRightX, headerY), (headerY += 3);
  if (firma?.telefon) doc.text(`Tel: ${firma.telefon}`, headerRightX, headerY), (headerY += 3);
  if (firma?.email_verbunden_adresse) doc.text(firma.email_verbunden_adresse, headerRightX, headerY), (headerY += 3);
  if (firma?.domain) doc.text(firma.domain, headerRightX, headerY);

  y = Math.max(y + 35, headerY + 5);

  // Trennlinie
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Titel
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("OFFERTE", margin, y);
  y += 12;

  // Offertennummer und Datum
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.dark);
  doc.setFont(undefined, "normal");

  const infoLeft = margin;
  const infoRight = pageWidth / 2;

  doc.setFont(undefined, "bold");
  doc.text("Offertennummer:", infoLeft, y);
  doc.setFont(undefined, "normal");
  doc.text(offerte.nummer || "-", infoLeft + 45, y);

  doc.setFont(undefined, "bold");
  doc.text("Datum:", infoRight, y);
  doc.setFont(undefined, "normal");
  doc.text(formatDatum(offerte.datum), infoRight + 25, y);
  y += 7;

  if (offerte.gueltig_bis) {
    doc.setFont(undefined, "bold");
    doc.text("Gültig bis:", infoRight, y);
    doc.setFont(undefined, "normal");
    doc.text(formatDatum(offerte.gueltig_bis), infoRight + 25, y);
    y += 7;
  }

  y += 3;

  // Kunde
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Offerte für:", infoLeft, y);
  y += 4;
  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  doc.text(offerte.kunde_name || "-", infoLeft + 5, y);
  y += 8;

  // Haupttitel/Projekt
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text(offerte.titel || "-", margin, y);
  y += 10;

  // Sektion: Leistungen
  if (offerte.leistungen && offerte.leistungen.length > 0) {
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text("Leistungsumfang", margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.setTextColor(60, 60, 60);

    offerte.leistungen.forEach((leistung) => {
      doc.text(`• ${leistung}`, margin + 3, y);
      y += 5;
    });
    y += 2;
  }

  // Sektion: Investition
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Investition", margin, y);
  y += 6;

  // Tabelle
  const tableTop = y;
  const col1 = margin;
  const col2 = pageWidth - margin - 50;
  const col3 = pageWidth - margin - 20;
  const rowHeight = 6;

  // Header
  doc.setFillColor(...COLORS.light);
  doc.rect(col1, tableTop, pageWidth - 2 * margin, rowHeight, "F");
  doc.setFont(undefined, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.dark);
  doc.text("Leistung", col1 + 2, tableTop + 4);
  doc.text("Betrag", col3 - 15, tableTop + 4);

  y = tableTop + rowHeight;

  // Rows
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  offerte.leistungen?.forEach((leistung, idx) => {
    doc.text(leistung, col1 + 2, y + 4);
    y += rowHeight;
  });

  // Subtotal & Total
  y += 2;
  const totalY = y;

  doc.setFont(undefined, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.dark);

  const einmalig = offerte.betrag_einmalig || 0;
  const monatlich = offerte.betrag_monatlich || 0;
  const subtotal = einmalig + monatlich;
  const mwst = subtotal * 0.081;
  const total = subtotal + mwst;

  if (einmalig > 0) {
    doc.text("Einmalige Kosten", col1 + 2, y);
    doc.text(formatCHF(einmalig), col3, y, { align: "right" });
    y += 6;
  }

  if (monatlich > 0) {
    doc.text("Monatliche Kosten", col1 + 2, y);
    doc.text(formatCHF(monatlich) + " / Monat", col3, y, { align: "right" });
    y += 6;
  }

  // Separator
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(col1, y - 2, pageWidth - margin, y - 2);

  // Summary Box
  y += 3;
  const boxHeight = 20;
  doc.setFillColor(...COLORS.light);
  doc.rect(col1, y, pageWidth - 2 * margin, boxHeight, "F");

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Gesamtbetrag exkl. MwSt.", col1 + 2, y + 4);
  doc.setFont(undefined, "bold");
  doc.text(formatCHF(subtotal), col3, y + 4, { align: "right" });

  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("MwSt. (8.1%)", col1 + 2, y + 9);
  doc.text(formatCHF(mwst), col3, y + 9, { align: "right" });

  doc.setFont(undefined, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  doc.text("GESAMTBETRAG inkl. MwSt.", col1 + 2, y + 15);
  doc.text(formatCHF(total), col3, y + 15, { align: "right" });

  y += boxHeight + 8;

  // Schlusswort
  if (pageHeight - y < 20) {
    doc.addPage();
    y = margin;
  }

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(
    "Wir freuen uns, Sie mit dieser Lösung unterstützen zu können.",
    margin,
    y,
    { maxWidth: pageWidth - 2 * margin }
  );

  return doc;
}