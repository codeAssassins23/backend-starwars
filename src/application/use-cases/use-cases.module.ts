import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/persistence/repository.module';
import { TOKENS } from 'src/domain/tokens/tokens';
import { AdaptersModule } from 'src/infrastructure/adapters/adapters.module';
import { TypeormUserRepositoryAdapter } from 'src/infrastructure/persistence/repositories/user.repository.adapter';
import { JwtServiceAdapter } from 'src/infrastructure/adapters/jwt/jwt.service.adapter';
import { BcryptServiceAdapter } from 'src/infrastructure/adapters/encryption/bcrypt.service.adapter';

@Module({
  imports: [RepositoryModule, AdaptersModule],
  providers: [
    {
      provide: TOKENS.USER_REPOSITORY,
      useClass: TypeormUserRepositoryAdapter,
    },
    {
      provide: TOKENS.JWT_SERVICE,
      useClass: JwtServiceAdapter,
    },
    {
      provide: TOKENS.ENCRYPTION_SERVICE,
      useClass: BcryptServiceAdapter,
    },
  ],
  exports: [
    TOKENS.USER_REPOSITORY,
    TOKENS.JWT_SERVICE,
    TOKENS.ENCRYPTION_SERVICE,
  ],
})
export class UseCasesModule {}
