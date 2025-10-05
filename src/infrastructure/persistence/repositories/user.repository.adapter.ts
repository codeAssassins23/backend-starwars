import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeormUserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    return user
      ? new User(user.id, user.username, user.password, user.role as any)
      : null;
  }

  async create(user: User): Promise<User> {
    const saved = await this.userRepo.save(user);
    return new User(
      saved.id,
      saved.username,
      saved.password,
      saved.role as any,
    );
  }
}
