import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: number;
  readonly password: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly username?: string;
  readonly access_token: string;
  readonly password_hash: string;
}
