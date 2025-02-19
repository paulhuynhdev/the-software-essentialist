import { User, ValidatedUser } from "@dddforum/shared/src/api/users";

export interface UsersRepository {
  save(user: ValidatedUser): Promise<User & { password: string }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  delete(email: string): Promise<void>;
  update(id: number, props: Partial<ValidatedUser>): Promise<User | null>;
  findAll(): Promise<User[]>;
}
