export type SafeUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string | null;
  country: string;
  phoneNumber: string;
  roleId: string;
  businessId: string;
};

export type SessionData = {
  user: SafeUser | null;
  loading: boolean;
  error?: Error;
};
