'use client';
import React, { createContext } from 'react';
import { RoleType, BusinessIndustry } from '@prisma/client';

type FullUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string | null;
  role: {
    roleType: RoleType;
  };
  business: {
    name: string;
    industry: BusinessIndustry;
  };
};

type SessionData = FullUser | null;

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

