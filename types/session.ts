import { User } from './user';

export type SessionData = {
  user: User;
  loading: boolean;
  error?: Error;
};
