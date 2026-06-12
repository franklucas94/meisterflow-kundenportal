import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function OnboardingGuard({ children }) {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: firmen = [], isLoading: firmenLoading } = useQuery({
    queryKey: ["firma", user?.id],
    queryFn: () => base44.entities.Firma.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userLoading || firmenLoading || !user) return;

    const firma = firmen[0];
    
    // Kein Firma-Datensatz ODER Onboarding noch nicht abgeschlossen → weiterleiten
    if (!firma || !firma.onboarding_abgeschlossen) {
      navigate("/onboarding", { replace: true });
    }
  }, [firmen, firmenLoading, userLoading, user, navigate]);

  // Loading state
  if (userLoading || firmenLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if onboarding is complete
  const firma = firmen[0];
  if (firma?.onboarding_abgeschlossen) {
    return children;
  }

  return null;
}