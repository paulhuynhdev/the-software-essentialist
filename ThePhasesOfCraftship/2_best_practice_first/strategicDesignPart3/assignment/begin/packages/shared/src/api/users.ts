import { APIResponse, GenericErrors, ServerError } from ".";

export type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

export type EmailAlreadyInUseError = 'EmailAlreadyInUse';

export type UsernameAlreadyTakenError = 'UsernameAlreadyTaken';

export type UserNotFoundError = "UserNotFound";

export type CreateUserErrors = GenericErrors | EmailAlreadyInUseError | UsernameAlreadyTakenError | UserNotFoundError;

export type GetUserByEmailErrors = ServerError | UserNotFoundError;

export type GetUserByEmailResponse = APIResponse<User, GetUserByEmailErrors>;

export type CreateUserResponse = APIResponse<User, CreateUserErrors>;

export type UserResponse = APIResponse<CreateUserResponse | GetUserByEmailResponse | null, CreateUserErrors>;
