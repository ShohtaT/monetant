import { User, CreateUserInput } from '../entities/User';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByAuthId(auth_id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: CreateUserInput): Promise<User>;
  delete(id: number): Promise<void>;
}
