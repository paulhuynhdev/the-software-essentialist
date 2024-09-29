import axios from "axios";
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

export const createUserAPI = (apiURL: string) => {
  return {
    register: async (input: CreateUserParams): Promise<CreateUserResponse> => {
      try {
        const successResponse = await axios.post(`${apiURL}/users/new`, {
          ...input
        });
        return successResponse.data as CreateUserResponse;
      } catch (error) {
        //@ts-ignore
        return error.response.data as CreateUserResponse;
      }
    },
    getUserByEmail: async (email: string): Promise<GetUserByEmailResponse> => {
      try {
        const successResponse = await axios.get(`${apiURL}/users/${email}`);
        return successResponse.data as GetUserByEmailResponse;
      } catch (err) {
        //@ts-ignore
        return err.response.data as GetUserByEmailResponse;
      }
    }
  }
}