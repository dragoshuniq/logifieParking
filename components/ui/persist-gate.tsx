import { useIsRestoring } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

type PersistGateProps = {
  children: React.ReactNode;
};

SplashScreen.preventAutoHideAsync();

export function PersistGate({ children }: PersistGateProps) {
  const isRestoring = useIsRestoring();

  useEffect(() => {
    if (!isRestoring) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }
  }, [isRestoring]);

  if (isRestoring) {
    return null;
  }

  return <>{children}</>;
}
