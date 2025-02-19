import { ValidatedUser, User } from "@dddforum/shared/src/api/users";
import { UsersRepository } from "../ports/usersRepository";
import { Spy } from "@dddforum/shared/testDoubles/spy";

export class InMemoryUsersRepositorySpy
  extends Spy<UsersRepository>
  implements UsersRepository
{
  private users: User[] = [];
  private static instance: InMemoryUsersRepositorySpy;

  constructor() {
    super();
    this.users = [];
  }

  public static getInstance(): InMemoryUsersRepositorySpy {
    if (!InMemoryUsersRepositorySpy.instance) {
      InMemoryUsersRepositorySpy.instance = new InMemoryUsersRepositorySpy();
    }
    return InMemoryUsersRepositorySpy.instance;
  }

  save(user: ValidatedUser): Promise<User & { password: string }> {
    this.addCall("save", [user]);
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
    this.addCall("findUserByEmail", [email]);
    return Promise.resolve(
      this.users.find((user) => user.email === email) || null,
    );
  }

  findUserByUsername(username: string): Promise<User | null> {
    this.addCall("findUserByUsername", [username]);
    return Promise.resolve(
      this.users.find((user) => user.username === username) || null,
    );
  }

  findById(id: number): Promise<User | null> {
    this.addCall("findById", [id]);
    return Promise.resolve(this.users.find((user) => user.id === id) || null);
  }

  findAll(): Promise<User[]> {
    this.addCall("findAll", []);
    return Promise.resolve(this.users);
  }

  delete(email: string): Promise<void> {
    this.addCall("delete", [email]);
    const index = this.users.findIndex((user) => user.email === email);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }

  update(id: number, props: Partial<ValidatedUser>): Promise<User | null> {
    this.addCall("update", [id, props]);
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...props };
      return Promise.resolve(this.users[userIndex]);
    }

    return Promise.resolve(null);
  }

  async reset() {
    this.users = [];
    this.calls = [];
  }
}
