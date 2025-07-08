interface AuthSignupRequest {
  email: string;
  password: string;
  nickname: string;
}

interface AuthSignupResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

interface AuthError {
  error: string;
  code: string;
}

export const signup = async (data: AuthSignupRequest): Promise<AuthSignupResponse> => {
  const response = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
