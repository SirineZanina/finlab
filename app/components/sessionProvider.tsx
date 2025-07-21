'use client';
import React, { createContext } from 'react';
import { SessionData } from '@/types/session';

const defaultSession: SessionData = {
  user: null,
  loading: true,
};

export const SessionContext = createContext<SessionData>(defaultSession);

// The Provider component
export function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionData;
}) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

