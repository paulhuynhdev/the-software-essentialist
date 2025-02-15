import { ValidatedUser, User } from "@dddforum/shared/src/api/users";
import { UsersRepository } from "../ports/usersRepository";

export class InMemoryUserRepository implements UsersRepository {
  private users: User[] = [];

  constructor() {
    this.users = [];
  }

  save(user: ValidatedUser): Promise<User & { password: string }> {
    const { email, firstName, lastName, username } = user;
    const newUser = {
      email,
      firstName,
      lastName,
      username,
      id: this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1,
      password: "",
    };
    this.users.push(newUser);
    return Promise.resolve({ ...newUser, password: "password" });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.email === email) || null,
    );
  }

  findUserByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.username === username) || null,
    );
  }

  findById(id: number): Promise<User | null> {
    return Promise.resolve(this.users.find((user) => user.id === id) || null);
  }

  delete(email: string): Promise<void> {
    const index = this.users.findIndex((user) => user.email === email);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }

  update(id: number, props: Partial<ValidatedUser>): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...props };
      return Promise.resolve(this.users[userIndex]);
    }

    return Promise.resolve(null);
  }

  async reset() {
    this.users = [];
  }
}
