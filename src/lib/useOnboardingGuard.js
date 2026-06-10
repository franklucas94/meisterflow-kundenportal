import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useOnboardingGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: firmen = [], isLoading } = useQuery({
    queryKey: ["firma", user?.id],
    queryFn: () => base44.entities.Firma.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isLoading || !user) return;
    const firma = firmen[0];
    const onOnboarding = location.pathname === "/onboarding";
    const onFirma = location.pathname === "/firma";
    if (!firma || !firma.onboarding_abgeschlossen) {
      if (!onOnboarding) navigate("/onboarding");
    }
  }, [firmen, isLoading, user, location.pathname]);
}