import { User } from './User';

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
}

export interface AuthSignupResponse {
  user: UserResponse;
}

export interface AuthLoginResponse {
  user: UserResponse;
}

export interface AuthSessionResponse {
  user: UserResponse;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };
}