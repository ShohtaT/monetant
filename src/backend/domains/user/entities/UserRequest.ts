export interface AuthSignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}