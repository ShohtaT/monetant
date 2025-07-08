export interface AuthSignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthSignupResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

export interface AuthError {
  error: string;
  code: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  nickname?: string;
  general?: string;
}
