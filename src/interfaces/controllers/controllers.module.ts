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
import { GetMovieUseCase } from 'src/application/use-cases/movies/get-movie.usecase';
import { CreateMovieUseCase } from 'src/application/use-cases/movies/create-movie.usecase';
import { UpdateMovieUseCase } from 'src/application/use-cases/movies/update-movie.usecase';
import { DeleteMovieUseCase } from 'src/application/use-cases/movies/delete-movie.usecase';

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
    {
      provide: TOKENS.GET_MOVIE_USE_CASE,
      useClass: GetMovieUseCase,
    },
    {
      provide: TOKENS.CREATE_MOVIE_USE_CASE,
      useClass: CreateMovieUseCase,
    },
    {
      provide: TOKENS.UPDATE_MOVIE_USE_CASE,
      useClass: UpdateMovieUseCase,
    },
    {
      provide: TOKENS.DELETE_MOVIE_USE_CASE,
      useClass: DeleteMovieUseCase,
    },
  ],
  exports: [
    TOKENS.LOGIN_USE_CASE,
    TOKENS.REGISTER_USE_CASE,
    TOKENS.GET_MOVIES_USE_CASE,
    TOKENS.SYNC_MOVIES_USE_CASE,
    TOKENS.GET_MOVIE_USE_CASE,
    TOKENS.CREATE_MOVIE_USE_CASE,
    TOKENS.UPDATE_MOVIE_USE_CASE,
    TOKENS.DELETE_MOVIE_USE_CASE,
  ],
})
export class ControllerModule {}
