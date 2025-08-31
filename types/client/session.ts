import { User } from './entities';

export type SessionData = {
  user: User | null;
  loading: boolean;
  error?: Error;
};
