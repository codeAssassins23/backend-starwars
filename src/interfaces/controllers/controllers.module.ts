import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';
import { AuthController } from './auth/auth.controller';
import { TOKENS } from 'src/domain/tokens/tokens';
import { LoginUseCase } from 'src/application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/application/use-cases/auth/register.use-case';
import { UseCasesModule } from 'src/application/use-cases/use-cases.module';
import { AdaptersModule } from 'src/infrastructure/adapters/adapters.module';
import { GetMoviesUseCase } from 'src/application/use-cases/movies/get-movies.usecase';
import { SyncMoviesUseCase } from 'src/application/use-cases/movies/sync-movies.usecase';
import { ExternalServicesModule } from 'src/infrastructure/external_services/swapi/swapi.module';

@Module({
  imports: [UseCasesModule, AdaptersModule, ExternalServicesModule],
  controllers: [MoviesController, AuthController],
  providers: [
    {
      provide: TOKENS.LOGIN_USE_CASE,
      useClass: LoginUseCase,
    },
    {
      provide: TOKENS.REGISTER_USE_CASE,
      useClass: RegisterUseCase,
    },
    {
      provide: TOKENS.GET_MOVIES_USE_CASE,
      useClass: GetMoviesUseCase,
    },
    {
      provide: TOKENS.SYNC_MOVIES_USE_CASE,
      useClass: SyncMoviesUseCase,
    },
  ],
  exports: [
    TOKENS.LOGIN_USE_CASE,
    TOKENS.REGISTER_USE_CASE,
    TOKENS.GET_MOVIES_USE_CASE,
    TOKENS.SYNC_MOVIES_USE_CASE,
  ],
})
export class ControllerModule {}
