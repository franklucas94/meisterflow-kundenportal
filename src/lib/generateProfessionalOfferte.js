import jsPDF from "jspdf";
import { formatDatum, formatCHF } from "@/lib/format";

const BLACK = [0, 0, 0];
const DARK_GRAY = [60, 60, 60];
const LIGHT_GRAY = [240, 240, 240];
const BORDER_GRAY = [200, 200, 200];

function addSection(doc, title, y, pageWidth, margin) {
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.text(title, margin, y);
  return y + 7;
}

function addText(doc, text, y, x = null, fontSize = 9, isBold = false, maxWidth = null) {
  doc.setFontSize(fontSize);
  doc.setFont(undefined, isBold ? "bold" : "normal");
  doc.setTextColor(...DARK_GRAY);
  const options = maxWidth ? { maxWidth } : {};
  doc.text(text, x || 15, y, options);
  return y + 5;
}

export function generateProfessionalOfferte(offerte, firma) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // ===== KOPF =====
  const logoSize = 20;
  if (firma?.logo_url) {
    try {
      doc.addImage(firma.logo_url, "JPEG", margin, y, logoSize, logoSize);
    } catch (e) {
      console.log("Logo konnte nicht geladen werden");
    }
  }

  // Firmendaten rechts
  const rightX = pageWidth - margin - 60;
  let headerY = y;
  
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  if (firma?.firmenname) {
    doc.text(firma.firmenname, rightX, headerY);
    headerY += 5;
  }

  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  if (firma?.adresse) {
    doc.text(firma.adresse, rightX, headerY);
    headerY += 4;
  }
  if (firma?.plz && firma?.ort) {
    doc.text(`${firma.plz} ${firma.ort}`, rightX, headerY);
    headerY += 4;
  }
  if (firma?.telefon) {
    doc.text(`Tel: ${firma.telefon}`, rightX, headerY);
    headerY += 4;
  }
  if (firma?.email_verbunden_adresse) {
    doc.text(firma.email_verbunden_adresse, rightX, headerY);
    headerY += 4;
  }
  if (firma?.domain) {
    doc.text(firma.domain, rightX, headerY);
  }

  y = Math.max(y + logoSize + 5, headerY + 8);

  // Trennlinie
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Offerte für / Kundendaten
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.text("Offerte für:", margin, y);
  y += 5;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text(offerte.kunde_name || "-", margin, y);
  y += 8;

  // Metadaten
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  
  const col1 = margin;
  const col2 = pageWidth / 2;

  doc.text("Datum:", col1, y);
  doc.setFont(undefined, "normal");
  doc.text(formatDatum(offerte.datum), col1 + 15, y);

  doc.setFont(undefined, "bold");
  doc.text("Offertennummer:", col2, y);
  doc.setFont(undefined, "normal");
  doc.text(offerte.nummer || "-", col2 + 30, y);
  y += 8;

  if (offerte.gueltig_bis) {
    doc.setFont(undefined, "bold");
    doc.text("Gültig bis:", col2, y);
    doc.setFont(undefined, "normal");
    doc.text(formatDatum(offerte.gueltig_bis), col2 + 30, y);
    y += 8;
  }

  y += 3;

  // ===== 1. AUSGANGSLAGE =====
  y = addSection(doc, "1. AUSGANGSLAGE", y, pageWidth, margin);
  y = addText(doc, "Ausgangslage für dieses Projekt...", y, margin, 9);
  y += 8;

  // ===== 2. ZIELE DES PROJEKTS =====
  y = addSection(doc, "2. ZIELE DES PROJEKTS", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("Die wichtigsten Ziele für dieses Projekt:", margin, y);
  y += 5;
  doc.text("• Professioneller digitaler Auftritt", margin + 3, y);
  y += 5;
  doc.text("• Erhöhte Sichtbarkeit und Reichweite", margin + 3, y);
  y += 5;
  doc.text("• Bessere Kundenerfahrung", margin + 3, y);
  y += 8;

  // ===== 3. EMPFOHLENE LÖSUNG =====
  y = addSection(doc, "3. EMPFOHLENE LÖSUNG", y, pageWidth, margin);
  y = addText(doc, "Basierend auf Ihrer Situation empfehlen wir folgende Lösung...", y, margin, 9);
  y += 8;

  // Check for new page
  if (pageHeight - y < 60) {
    doc.addPage();
    y = margin;
  }

  // ===== 4. LEISTUNGSUMFANG =====
  y = addSection(doc, "4. LEISTUNGSUMFANG", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  
  if (offerte.leistungen && offerte.leistungen.length > 0) {
    offerte.leistungen.forEach((leistung) => {
      doc.text(`• ${leistung}`, margin + 3, y);
      y += 5;
    });
  } else {
    doc.text("• Beratung und Konzeption", margin + 3, y);
    y += 5;
    doc.text("• Design und Entwicklung", margin + 3, y);
    y += 5;
    doc.text("• Integration und Testing", margin + 3, y);
    y += 5;
  }
  y += 5;

  // ===== 5. UMSETZUNGSDETAILS =====
  if (pageHeight - y < 60) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "5. UMSETZUNGSDETAILS", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("Die Umsetzung umfasst alle notwendigen Komponenten:", margin, y);
  y += 5;
  doc.text("• Responsive Design für alle Geräte", margin + 3, y);
  y += 5;
  doc.text("• Benutzerfreundliche Navigation", margin + 3, y);
  y += 5;
  doc.text("• Suchmaschinen-Optimierung (SEO)", margin + 3, y);
  y += 5;
  doc.text("• Analytics und Tracking", margin + 3, y);
  y += 8;

  // ===== 6. MEHRWERT FÜR DEN KUNDEN =====
  y = addSection(doc, "6. MEHRWERT FÜR DEN KUNDEN", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("Mit dieser Lösung erhalten Sie:", margin, y);
  y += 5;
  doc.text("• Professioneller Markenauftritt", margin + 3, y);
  y += 5;
  doc.text("• Erhöhte Sichtbarkeit bei Google", margin + 3, y);
  y += 5;
  doc.text("• Mehr qualifizierte Anfragen", margin + 3, y);
  y += 5;
  doc.text("• Bessere Kundenbindung", margin + 3, y);
  y += 8;

  // ===== 7. PROJEKTABLAUF =====
  if (pageHeight - y < 80) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "7. PROJEKTABLAUF", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  
  const phases = [
    { name: "Phase 1", desc: "Analyse & Planung" },
    { name: "Phase 2", desc: "Konzept & Design" },
    { name: "Phase 3", desc: "Umsetzung" },
    { name: "Phase 4", desc: "Testing & Optimierung" },
    { name: "Phase 5", desc: "Veröffentlichung & Übergabe" },
  ];

  phases.forEach((phase) => {
    doc.text(phase.name, margin, y);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...DARK_GRAY);
    doc.text(phase.desc, margin + 25, y);
    y += 5;
    doc.setFont(undefined, "bold");
    doc.setTextColor(...BLACK);
  });
  y += 5;

  // ===== 8. INVESTITION =====
  if (pageHeight - y < 80) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "8. INVESTITION", y, pageWidth, margin);
  y += 3;

  // Tabelle Header
  const tableLeft = margin;
  const tableRight = pageWidth - margin - 30;
  const tableWidth = tableRight - tableLeft;
  const rowH = 6;

  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(tableLeft, y, tableWidth, rowH, "F");
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.setDrawColor(...BORDER_GRAY);
  doc.rect(tableLeft, y, tableWidth, rowH);
  
  doc.text("Leistung", tableLeft + 2, y + 4);
  doc.text("Betrag (CHF)", tableRight - 20, y + 4);
  y += rowH;

  // Leistungen in Tabelle
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);

  if (offerte.leistungen && offerte.leistungen.length > 0) {
    offerte.leistungen.forEach((leistung) => {
      doc.setDrawColor(...BORDER_GRAY);
      doc.rect(tableLeft, y, tableWidth, rowH);
      doc.text(leistung, tableLeft + 2, y + 4);
      y += rowH;
    });
  }

  // Gesamtbetrag Berechnung
  const einmalig = offerte.betrag_einmalig || 0;
  const monatlich = offerte.betrag_monatlich || 0;
  const subtotal = einmalig + monatlich;
  const mwst = subtotal * 0.081;
  const total = subtotal + mwst;

  y += 3;
  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.setFontSize(9);

  doc.text("Gesamtbetrag exkl. MwSt.", tableLeft + 2, y);
  doc.text(formatCHF(subtotal), tableRight - 20, y);
  y += 6;

  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...DARK_GRAY);
  doc.text("MwSt. (8.1%)", tableLeft + 2, y);
  doc.text(formatCHF(mwst), tableRight - 20, y);
  y += 6;

  doc.setFont(undefined, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);
  doc.text("GESAMTBETRAG inkl. MwSt.", tableLeft + 2, y);
  doc.text(formatCHF(total), tableRight - 20, y);
  y += 10;

  // ===== 9. OPTIONALE ZUSATZLEISTUNGEN =====
  if (pageHeight - y < 60) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "9. OPTIONALE ZUSATZLEISTUNGEN", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("Gerne unterstützen wir Sie auch bei:", margin, y);
  y += 5;
  doc.text("• SEO Betreuung und Optimierung", margin + 3, y);
  y += 5;
  doc.text("• Laufende Wartung und Support", margin + 3, y);
  y += 5;
  doc.text("• Content Erstellung", margin + 3, y);
  y += 5;
  doc.text("• Google Ads und Online Marketing", margin + 3, y);
  y += 8;

  // ===== 10. ZEITRAHMEN =====
  if (pageHeight - y < 60) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "10. ZEITRAHMEN", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);

  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.text("Geplanter Projektstart:", margin, y);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text(formatDatum(offerte.datum), margin + 50, y);
  y += 6;

  doc.setFont(undefined, "bold");
  doc.setTextColor(...BLACK);
  doc.text("Geschätzte Umsetzungsdauer:", margin, y);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("4-8 Wochen", margin + 50, y);
  y += 8;

  // ===== 11. NÄCHSTE SCHRITTE =====
  y = addSection(doc, "11. NÄCHSTE SCHRITTE", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text("1. Offerte prüfen", margin + 3, y);
  y += 5;
  doc.text("2. Freigabe erteilen", margin + 3, y);
  y += 5;
  doc.text("3. Projektstart", margin + 3, y);
  y += 5;
  doc.text("4. Umsetzung nach Vereinbarung", margin + 3, y);
  y += 5;
  doc.text("5. Übergabe und Schulung", margin + 3, y);
  y += 8;

  // ===== 12. SCHLUSSWORT =====
  if (pageHeight - y < 30) {
    doc.addPage();
    y = margin;
  }

  y = addSection(doc, "12. SCHLUSSWORT", y, pageWidth, margin);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...DARK_GRAY);
  doc.text(
    "Wir freuen uns auf die Zusammenarbeit mit Ihnen. Diese Lösung wird Ihr Unternehmen digitalisieren und Ihre Wettbewerbsfähigkeit erheblich verbessern.",
    margin,
    y,
    { maxWidth: pageWidth - 2 * margin }
  );

  return doc;
}