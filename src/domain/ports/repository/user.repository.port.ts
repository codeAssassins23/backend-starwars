import { User } from '../../entities/user.entity';

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
