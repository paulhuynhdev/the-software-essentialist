import { Database } from "../../shared/database";
import {
  UserEmailAlreadyExistException,
  UsernameAlreadyExistException,
} from "../../shared/exceptions";
import { CreateUserCommand } from "./userCommand";
export class UserService {
  constructor(private db: Database) {}

  async createUser(userDTO: CreateUserCommand) {
    const existingUserByEmail = await this.db.users.findUserByEmail(userDTO.email);
    if (existingUserByEmail) {
      throw new UserEmailAlreadyExistException();
    }

    const existingUserByUsername = await this.db.users.findUserByUsername(userDTO.username);
    if (existingUserByUsername) {
      throw new UsernameAlreadyExistException();
    }

    const result = await this.db.users.save(userDTO);

    return result;
  }
}
