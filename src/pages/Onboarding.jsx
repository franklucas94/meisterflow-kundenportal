import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import SchrittFirma from "@/components/onboarding/SchrittFirma";
import SchrittWebsite from "@/components/onboarding/SchrittWebsite";
import SchrittGoogle from "@/components/onboarding/SchrittGoogle";
import SchrittKommunikation from "@/components/onboarding/SchrittKommunikation";
import SchrittZahlungen from "@/components/onboarding/SchrittZahlungen";
import SchrittAutomationen from "@/components/onboarding/SchrittAutomationen";
import SchrittBetrieb from "@/components/onboarding/SchrittBetrieb";
import SchrittDateien from "@/components/onboarding/SchrittDateien";

const GESAMT_SCHRITTE = 8;

const INITIAL_FORM = {
  firmenname: "", ansprechpartner: "", email: "", telefon: "",
  adresse: "", plz: "", ort: "", uid_nummer: "", logo_url: "", rechnungsadresse: "",
  domain: "", hosting_zugang: "", hat_website: false,
  domain_registrar: "", domain_zugang_login: "", domain_zugang_delegiert: false,
  hosting_anbieter: "", hosting_login_url: "", hosting_benutzername: "",
  cms_typ: "", cms_admin_url: "", cms_benutzername: "",
  kalender_verbunden: "", google_verbunden: false,
  google_business_vorhanden: false, google_business_url: "",
  google_analytics_oauth: false, google_search_console_oauth: false,
  whatsapp_verbunden: false, whatsapp_nummer: "",
  sms_verbunden: false, sms_eigene_nummer: "", sms_meisterflow_nummer: false,
  email_verbunden: "", email_verbunden_adresse: "",
  branche: "", dienstleistungen: [], eigene_dienstleistung: "",
  google_bewertungslink: "",
  stripe_zahlungslink: "", stripe_verbunden: false,
  mwst_pflichtig: false, mwst_nummer: "", zahlungsfrist_tage: 30,
  iban: "", bankname: "", kontoinhaber: "", qr_rechnung: false,
  twint_aktiv: false, kreditkarten_aktiv: false, apple_pay_aktiv: false,
  google_pay_aktiv: false, rechnung_zahlung: true, bar_zahlung: false,
  automation_termine: false, automation_erinnerungen: false,
  automation_offerte_nachfassen: false, automation_rechnung_erinnerung: false,
  automation_bewertungsanfrage: false, automation_wiederkehrend: false,
  automation_whatsapp: false,
  mitarbeiter_anzahl: 1, regionen: "", oeffnungszeiten: "",
  notfallservice: false, unternehmensbeschreibung: "", auftragsablauf: "",
  zugangsdaten_speichern: false,
  firma_bilder_urls: [], agb_url: "", datenschutz_url: "",
  preisliste_url: "", broschuere_urls: [], zertifikate_urls: [],
  onboarding_schritt: 1, onboarding_abgeschlossen: false,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [schritt, setSchritt] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });
  const { data: firmen = [] } = useQuery({
    queryKey: ["firma", user?.id],
    queryFn: () => base44.entities.Firma.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const bestehendeFirma = firmen[0];

  useEffect(() => {
    if (bestehendeFirma) {
      setForm((f) => ({ ...f, ...bestehendeFirma, eigene_dienstleistung: "" }));
      setSchritt(bestehendeFirma.onboarding_abgeschlossen ? 1 : bestehendeFirma.onboarding_schritt || 1);
    }
  }, [bestehendeFirma]);

  const prepareData = (data) => {
    const clean = { ...data };
    delete clean._logoFile;
    delete clean._logoPreview;
    delete clean.eigene_dienstleistung;
    delete clean._agb_url_preview;
    delete clean._datenschutz_url_preview;
    delete clean._preisliste_url_preview;
    return { ...clean, user_id: user?.id };
  };

  const speichern = async (update = {}, fertig = false) => {
    setSaving(true);
    const neuerSchritt = fertig ? schritt : schritt + 1;
    const data = prepareData({
      ...form,
      ...update,
      onboarding_schritt: neuerSchritt,
      onboarding_abgeschlossen: fertig,
    });
    if (bestehendeFirma?.id) {
      await base44.entities.Firma.update(bestehendeFirma.id, data);
    } else {
      await base44.entities.Firma.create(data);
    }
    qc.invalidateQueries({ queryKey: ["firma"] });
    setSaving(false);
  };

  const weiter = async (update = {}) => {
    if (schritt < GESAMT_SCHRITTE) {
      await speichern(update);
      setSchritt((s) => s + 1);
    } else {
      await speichern(update, true);
      navigate("/");
    }
  };

  const schrittProps = (schrittNr) => ({
    form, setForm, saving,
    onWeiter: (update = {}) => weiter(update),
    onZurueck: () => setSchritt(schrittNr - 1),
    onUeberspringen: () => weiter(),
  });

  const schrittInhalt = {
    1: <SchrittFirma {...schrittProps(1)} />,
    2: <SchrittWebsite {...schrittProps(2)} />,
    3: <SchrittGoogle {...schrittProps(3)} />,
    4: <SchrittKommunikation {...schrittProps(4)} />,
    5: <SchrittZahlungen {...schrittProps(5)} />,
    6: <SchrittAutomationen {...schrittProps(6)} />,
    7: <SchrittBetrieb {...schrittProps(7)} />,
    8: <SchrittDateien {...schrittProps(8)} />,
  };

  return (
    <OnboardingLayout schritt={schritt}>
      {schrittInhalt[schritt]}
    </OnboardingLayout>
  );
}