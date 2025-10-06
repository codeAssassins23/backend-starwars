import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/persistence/repository.module';
import { TOKENS } from 'src/domain/tokens/tokens';
import { AdaptersModule } from 'src/infrastructure/adapters/adapters.module';
import { TypeormUserRepositoryAdapter } from 'src/infrastructure/persistence/repositories/user.repository.adapter';
import { JwtServiceAdapter } from 'src/infrastructure/adapters/jwt/jwt.service.adapter';
import { BcryptServiceAdapter } from 'src/infrastructure/adapters/encryption/bcrypt.service.adapter';
import { TypeormMovieRepositoryAdapter } from 'src/infrastructure/persistence/repositories/movie.repository.adapter';
import { SwapiService } from 'src/infrastructure/external_services/swapi/update-movies.swapi';
import { ExternalServicesModule } from 'src/infrastructure/external_services/swapi/swapi.module';

@Module({
  imports: [RepositoryModule, AdaptersModule, ExternalServicesModule],
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
    {
      provide: TOKENS.MOVIE_REPOSITORY,
      useClass: TypeormMovieRepositoryAdapter,
    },
    {
      provide: TOKENS.SWAPI_SERVICE,
      useClass: SwapiService,
    },
  ],
  exports: [
    TOKENS.USER_REPOSITORY,
    TOKENS.JWT_SERVICE,
    TOKENS.ENCRYPTION_SERVICE,
    TOKENS.MOVIE_REPOSITORY,
    TOKENS.SWAPI_SERVICE,
  ],
})
export class UseCasesModule {}
