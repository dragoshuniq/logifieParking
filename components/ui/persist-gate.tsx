import { useIsRestoring } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

import { checkOnboardingComplete } from "@/components/onboarding";

type PersistGateProps = {
  children: React.ReactNode;
};

SplashScreen.preventAutoHideAsync();

export function PersistGate({ children }: PersistGateProps) {
  const isRestoring = useIsRestoring();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isRestoring && !isReady) {
      checkOnboardingComplete().then((complete) => {
        setIsReady(true);
        setTimeout(() => {
          if (!complete) {
            router.replace("/onboarding");
          }
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 100);
        }, 50);
      });
    }
  }, [isRestoring, isReady]);

  if (isRestoring) {
    return null;
  }

  return <>{children}</>;
}
