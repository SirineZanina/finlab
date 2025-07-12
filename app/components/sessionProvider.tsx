'use client';

import React, { createContext } from 'react';
import { z } from 'zod';
import { sessionSchema } from '../(auth)/_nextjs/schema';

type SessionData = z.infer<typeof sessionSchema> | null;

export const SessionContext = createContext<SessionData>(null);

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

