import { DomainError } from '../../../utils/errors';

export class User {
  private constructor(
    public readonly id: number,
    public readonly authId: string,
    public readonly email: string,
    public readonly nickname: string,
    public readonly lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(input: {
    authId: string;
    email: string;
    nickname: string;
  }): Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'> {
    if (!input.authId) {
      throw new DomainError('Auth ID is required', 'INVALID_AUTH_ID');
    }

    if (!input.email) {
      throw new DomainError('Email is required', 'INVALID_EMAIL');
    }

    if (!input.nickname || input.nickname.trim().length === 0) {
      throw new DomainError('Nickname is required', 'INVALID_NICKNAME');
    }

    if (input.nickname.length > 50) {
      throw new DomainError('Nickname must be less than 50 characters', 'INVALID_NICKNAME_LENGTH');
    }

    return {
      authId: input.authId,
      email: input.email,
      nickname: input.nickname.trim(),
    };
  }

  static fromDatabase(data: {
    id: number;
    auth_id: string;
    email: string;
    nickname: string;
    last_login_at: Date | null;
    created_at: Date;
    updated_at: Date;
  }): User {
    return new User(
      data.id,
      data.auth_id,
      data.email,
      data.nickname,
      data.last_login_at,
      data.created_at,
      data.updated_at
    );
  }
}

export type CreateUserInput = {
  authId: string;
  email: string;
  nickname: string;
};
