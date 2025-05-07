import { AuthRepository } from '@/repositories/authRepository';
import { UserRepository } from '@/repositories/userRepository';
import { User } from '@/types/user';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor() {
    this.authRepository = new AuthRepository();
    this.userRepository = new UserRepository();
  }

  async createUser(email: string, password: string, nickname: string) {
    const user = await this.authRepository.signUp(email, password);
    if (!user) throw new Error('User cannot be created');

    await this.authRepository.createUserProfile(user.id, nickname, email);
  }

  async signIn(email: string, password: string) {
    await this.authRepository.signIn(email, password);
  }

  async signOut() {
    await this.authRepository.signOut();
  }

  async getSession() {
    return await this.authRepository.getSession();
  }

  async getUser() {
    return await this.authRepository.getUser();
  }

  async getCurrentUser(): Promise<User | null> {
    const uuid = await this.getCurrentUserUuid();
    if (!uuid) return null;

    return await this.userRepository.getUserByAuthId(uuid);
  }

  private async getCurrentUserUuid(): Promise<string | null> {
    const session = await this.getSession();
    if (!session.session) return null;

    const { user } = await this.getUser();
    if (!user) {
      throw new Error('User not found');
    }

    return user.id;
  }
}
