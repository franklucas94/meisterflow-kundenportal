import jsPDF from "jspdf";
import { formatDatum, formatCHF } from "@/lib/format";

export function generateProfessionalOfferte(offerte, firma) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // ===== HEADER: LOGO & FIRMENDATEN =====
  if (firma?.logo_url) {
    try {
      doc.addImage(firma.logo_url, "JPEG", margin, y, 25, 25);
    } catch (e) {
      console.log("Logo konnte nicht geladen werden");
    }
  }

  const headerX = margin + 35;
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  if (firma?.firmenname) {
    doc.text(firma.firmenname, headerX, y);
  }

  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(80, 80, 80);
  y += 5;
  if (firma?.adresse) doc.text(firma.adresse, headerX, y), (y += 3);
  if (firma?.plz && firma?.ort) doc.text(`${firma.plz} ${firma.ort}`, headerX, y), (y += 3);
  if (firma?.telefon) doc.text(`Tel: ${firma.telefon}`, headerX, y), (y += 3);
  if (firma?.email_verbunden_adresse) doc.text(firma.email_verbunden_adresse, headerX, y), (y += 3);
  if (firma?.domain) doc.text(firma.domain, headerX, y);

  y = margin + 35;

  // Trennlinie
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // ===== OFFERTE TITEL =====
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("OFFERTE", margin, y);
  y += 12;

  // ===== KUNDE & METADATEN =====
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);

  // Zwei Spalten
  const leftCol = margin;
  const rightCol = pageWidth / 2;

  doc.text("Für:", leftCol, y);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(offerte.kunde_name || "-", leftCol + 8, y);

  doc.setFont(undefined, "bold");
  doc.setFontSize(9);
  doc.text("Datum:", rightCol, y);
  doc.setFont(undefined, "normal");
  doc.text(formatDatum(offerte.datum), rightCol + 13, y);
  y += 6;

  doc.setFont(undefined, "bold");
  doc.text("Offertennummer:", leftCol, y);
  doc.setFont(undefined, "normal");
  doc.text(offerte.nummer || "-", leftCol + 35, y);

  doc.setFont(undefined, "bold");
  doc.text("Gültig bis:", rightCol, y);
  doc.setFont(undefined, "normal");
  doc.text(formatDatum(offerte.gueltig_bis || offerte.datum), rightCol + 13, y);
  y += 10;

  // Projekt Title
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(offerte.titel || "-", margin, y);
  y += 10;

  // ===== 1. AUSGANGSLAGE =====
  addSection(doc, "1. AUSGANGSLAGE", margin, y, contentWidth);
  y += 8;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(
    "Die aktuelle Situation bietet große Chancen zur Digitalisierung und Optimierung Ihres Unternehmens.",
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 10;

  // ===== 2. ZIELE =====
  addSection(doc, "2. ZIELE DES PROJEKTS", margin, y, contentWidth);
  y += 8;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  const goals = [
    "Professioneller Online-Auftritt",
    "Erhöhte Sichtbarkeit und Reichweite",
    "Bessere Kundenerfahrung",
    "Generierung qualifizierter Anfragen",
  ];
  goals.forEach((goal) => {
    doc.text(`• ${goal}`, margin + 3, y);
    y += 5;
  });
  y += 5;

  // Check Page Break
  if (pageHeight - y < 80) {
    doc.addPage();
    y = margin;
  }

  // ===== 3. EMPFOHLENE LÖSUNG =====
  addSection(doc, "3. EMPFOHLENE LÖSUNG", margin, y, contentWidth);
  y += 8;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(
    "Wir empfehlen eine ganzheitliche Lösung, die alle Aspekte Ihres Projektziels abdeckt und langfristige Erfolge sichert.",
    margin,
    y,
    { maxWidth: contentWidth }
  );
  y += 10;

  // ===== 4. LEISTUNGSUMFANG =====
  addSection(doc, "4. LEISTUNGSUMFANG", margin, y, contentWidth);
  y += 8;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);

  if (offerte.leistungen && offerte.leistungen.length > 0) {
    offerte.leistungen.forEach((leistung) => {
      doc.text(`• ${leistung}`, margin + 3, y);
      y += 5;
    });
  } else {
    doc.text("• Beratung und Analyse", margin + 3, y);
    y += 5;
    doc.text("• Konzept und Planung", margin + 3, y);
    y += 5;
    doc.text("• Design und Gestaltung", margin + 3, y);
    y += 5;
    doc.text("• Entwicklung und Umsetzung", margin + 3, y);
    y += 5;
    doc.text("• Testing und Optimierung", margin + 3, y);
  }
  y += 8;

  // Check Page Break
  if (pageHeight - y < 80) {
    doc.addPage();
    y = margin;
  }

  // ===== 5. PROJEKTABLAUF =====
  addSection(doc, "5. PROJEKTABLAUF", margin, y, contentWidth);
  y += 8;

  const phases = ["Analyse", "Konzept", "Design", "Umsetzung", "Testing", "Übergabe"];
  const phaseColWidth = contentWidth / 3;
  let phaseX = margin;
  let phaseY = y;

  phases.forEach((phase, idx) => {
    if (idx % 3 === 0 && idx !== 0) {
      phaseY += 14;
      phaseX = margin;
    }

    // Box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(phaseX, phaseY, phaseColWidth - 2, 10);

    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(phase, phaseX + 2, phaseY + 6, { align: "center", maxWidth: phaseColWidth - 4 });

    phaseX += phaseColWidth;
  });

  y += 30;

  // ===== 6. INVESTITION =====
  addSection(doc, "6. INVESTITION", margin, y, contentWidth);
  y += 8;

  // Tabelle
  const tableLeft = margin;
  const tableRight = pageWidth - margin;
  const tableWidth = tableRight - tableLeft;
  const rowHeight = 6;

  // Header
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(180, 180, 180);
  doc.rect(tableLeft, y, tableWidth, rowHeight, "F");
  doc.setLineWidth(0.3);
  doc.rect(tableLeft, y, tableWidth, rowHeight);

  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Leistung", tableLeft + 3, y + 4);
  doc.text("Betrag", tableRight - 25, y + 4, { align: "right" });
  y += rowHeight;

  // Leistungen
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  if (offerte.leistungen && offerte.leistungen.length > 0) {
    offerte.leistungen.slice(0, 5).forEach((leistung) => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(tableLeft, y + rowHeight, tableRight, y + rowHeight);
      doc.text(leistung, tableLeft + 3, y + 4);
      y += rowHeight;
    });
  }

  // Spacing
  y += 4;

  // Gesamtbetrag
  const einmalig = offerte.betrag_einmalig || 0;
  const monatlich = offerte.betrag_monatlich || 0;
  const subtotal = einmalig + monatlich;
  const mwst = subtotal * 0.081;
  const total = subtotal + mwst;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);

  if (einmalig > 0) {
    doc.text("Einmaliger Betrag", tableLeft, y);
    doc.text(formatCHF(einmalig), tableRight - 3, y, { align: "right" });
    y += 5;
  }

  if (monatlich > 0) {
    doc.text("Monatlicher Betrag", tableLeft, y);
    doc.text(formatCHF(monatlich) + " / Monat", tableRight - 3, y, { align: "right" });
    y += 5;
  }

  // Separator
  y += 2;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(tableLeft, y, tableRight, y);
  y += 5;

  // Subtotal
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Subtotal exkl. MwSt.", tableLeft, y);
  doc.setFont(undefined, "bold");
  doc.text(formatCHF(subtotal), tableRight - 3, y, { align: "right" });
  y += 5;

  // MwSt
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("MwSt. (8.1%)", tableLeft, y);
  doc.text(formatCHF(mwst), tableRight - 3, y, { align: "right" });
  y += 6;

  // Total
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(tableLeft, y - 1, tableRight, y - 1);
  doc.text("GESAMTBETRAG INKL. MWST.", tableLeft, y);
  doc.text(formatCHF(total), tableRight - 3, y, { align: "right" });
  y += 10;

  // Check Page Break
  if (pageHeight - y < 60) {
    doc.addPage();
    y = margin;
  }

  // ===== 7. NÄCHSTE SCHRITTE =====
  addSection(doc, "7. NÄCHSTE SCHRITTE", margin, y, contentWidth);
  y += 8;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);

  const steps = [
    "1. Offerte prüfen",
    "2. Freigabe und Bestätigung",
    "3. Projektstart",
    "4. Umsetzung",
    "5. Übergabe",
  ];

  steps.forEach((step) => {
    doc.text(step, margin + 3, y);
    y += 5;
  });

  y += 8;

  // ===== 8. SCHLUSSWORT =====
  if (pageHeight - y < 30) {
    doc.addPage();
    y = margin;
  }

  addSection(doc, "8. SCHLUSSWORT", margin, y, contentWidth);
  y += 8;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(
    "Wir freuen uns auf die Zusammenarbeit und sind davon überzeugt, dass wir mit dieser Lösung Ihrem Unternehmen einen wertvollen Mehrwert bieten können.",
    margin,
    y,
    { maxWidth: contentWidth }
  );

  return doc;
}

function addSection(doc, title, x, y, width) {
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(title, x, y);

  // Unterline
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  const textWidth = doc.getTextWidth(title);
  doc.line(x, y + 2, x + textWidth, y + 2);
}