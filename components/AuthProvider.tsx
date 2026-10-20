"use client";

import { createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react";

const AuthEnabledContext = createContext(false);

export const useAuthEnabled = () => useContext(AuthEnabledContext);

export default function AuthProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return (
    <AuthEnabledContext.Provider value={enabled}>
      {enabled ? <SessionProvider>{children}</SessionProvider> : children}
    </AuthEnabledContext.Provider>
  );
}
