import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { TOKENS } from 'src/domain/tokens/tokens';
import type { EncryptionServicePort } from 'src/domain/ports/encryption.service.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(username: string, password: string) {
    const existing = await this.userRepo.findByUsername(username);
    if (existing) throw new ConflictException('User already exists');

    const hashed = await this.encryptionService.hash(password);
    const newUser = new User(0, username, hashed, 'user');
    const saved = await this.userRepo.create(newUser);
    return saved.toSafeUser();
  }
}
