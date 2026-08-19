import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

@Injectable()
export class UserService {
  private users = new Map<string, User>();

  async create(email: string, password: string): Promise<Omit<User, 'password'>> {
    const existing = Array.from(this.users.values()).find((u) => u.email === email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      password: hashed,
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);
    const { password: _, ...result } = user;
    return result;
  }

  async validate(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const { password: _, ...result } = user;
    return result;
  }
}
