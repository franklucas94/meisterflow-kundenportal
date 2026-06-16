import React from "react";
import { cn } from "@/lib/utils";

const BLAU = "bg-blue-50 text-blue-700 border-blue-200";
const GRUEN = "bg-emerald-50 text-emerald-700 border-emerald-200";
const GELB = "bg-amber-50 text-amber-700 border-amber-200";
const ROT = "bg-red-50 text-red-600 border-red-200";
const GRAU = "bg-slate-100 text-slate-500 border-slate-200";
const VIOLETT = "bg-violet-50 text-violet-700 border-violet-200";

export const STATUS_CONFIG = {
  neu: { label: "New", className: BLAU },
  in_bearbeitung: { label: "In Progress", className: GELB },
  offeriert: { label: "Quoted", className: VIOLETT },
  gewonnen: { label: "Won", className: GRUEN },
  verloren: { label: "Lost", className: GRAU },
  geplant: { label: "Planned", className: BLAU },
  bestaetigt: { label: "Confirmed", className: GRUEN },
  abgeschlossen: { label: "Completed", className: GRAU },
  abgesagt: { label: "Cancelled", className: ROT },
  angefragt: { label: "Requested", className: GELB },
  erhalten: { label: "Received", className: GRUEN },
  beantwortet: { label: "Answered", className: BLAU },
  entwurf: { label: "Draft", className: GRAU },
  gesendet: { label: "Sent", className: BLAU },
  akzeptiert: { label: "Accepted", className: GRUEN },
  abgelehnt: { label: "Rejected", className: ROT },
  offen: { label: "Open", className: GELB },
  bezahlt: { label: "Paid", className: GRUEN },
  ueberfaellig: { label: "Overdue", className: ROT },
  storniert: { label: "Cancelled", className: GRAU },
  aktiv: { label: "Active", className: GRUEN },
  inaktiv: { label: "Inactive", className: GRAU },
};

export default function StatusBadge({ status, className }) {
  const cfg = STATUS_CONFIG[status] || { label: status, className: GRAU };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}