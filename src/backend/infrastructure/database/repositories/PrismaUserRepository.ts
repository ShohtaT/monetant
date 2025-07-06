import { UserRepository } from '../../../domains/user/repositories/UserRepository';
import { User, CreateUserInput } from '../../../domains/user/entities/User';
import { prisma } from '../../../../lib/prisma';
import { DatabaseError } from '../../../utils/errors';

export class PrismaUserRepository implements UserRepository {
  async findById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return User.fromDatabase(user);
    } catch {
      throw new DatabaseError('Failed to find user by ID');
    }
  }

  async findByAuthId(auth_id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { auth_id },
      });

      if (!user) return null;

      return User.fromDatabase(user);
    } catch {
      throw new DatabaseError('Failed to find user by auth ID');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      return User.fromDatabase(user);
    } catch {
      throw new DatabaseError('Failed to find user by email');
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await prisma.user.count({
        where: { email },
      });

      return count > 0;
    } catch {
      throw new DatabaseError('Failed to check email existence');
    }
  }

  async save(userInput: CreateUserInput): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          auth_id: userInput.auth_id,
          email: userInput.email,
          nickname: userInput.nickname,
        },
      });

      return User.fromDatabase(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new DatabaseError('Email already exists');
      }
      throw new DatabaseError('Failed to save user');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch {
      throw new DatabaseError('Failed to delete user');
    }
  }
}
