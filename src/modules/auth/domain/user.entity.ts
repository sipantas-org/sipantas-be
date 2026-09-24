export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
