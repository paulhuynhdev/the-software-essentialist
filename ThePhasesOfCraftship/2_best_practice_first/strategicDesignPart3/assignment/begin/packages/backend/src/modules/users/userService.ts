import { Database } from "../../shared/database";
import {
  UserEmailAlreadyExistException,
  UsernameAlreadyExistException,
  UserNotFoundException,
} from "../../shared/exceptions";
import { CreateUserCommand } from "./userCommand";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";

export class UserService {
  constructor(private db: Database, private emailAPI: TransactionalEmailAPI) { }

  async createUser(userDTO: CreateUserCommand) {
    const existingUserByEmail = await this.db.users.findUserByEmail(userDTO.email);
    if (existingUserByEmail) {
      throw new UserEmailAlreadyExistException();
    }

    const existingUserByUsername = await this.db.users.findUserByUsername(userDTO.username);
    if (existingUserByUsername) {
      throw new UsernameAlreadyExistException();
    }

    const { user } = await this.db.users.save(userDTO);

    await this.emailAPI.sendMail({
      to: user.email,
      subject: "Your login details to DDDForum",
      text: `Welcome to DDDForum. You can login with the following details </br>
      email: ${user.email}
      password: ${user.password}`,
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.db.users.findUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }
}
