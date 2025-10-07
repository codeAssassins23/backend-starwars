import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepositoryPort } from '../../../domain/ports/repository/user.repository.port';
import type { JwtServicePort } from '../../../domain/ports/services/jwt.service.port';
import { TOKENS } from '../../../domain/tokens/tokens';
import type { EncryptionServicePort } from 'src/domain/ports/services/encryption.service.port';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(TOKENS.JWT_SERVICE)
    private readonly jwtService: JwtServicePort,
    @Inject(TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(username: string, password: string) {
    const user = await this.userRepo.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.encryptionService.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return {
      access_token: token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}
