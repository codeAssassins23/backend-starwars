import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';
import { AuthController } from './auth/auth.controller';
import { TOKENS } from 'src/domain/tokens/tokens';
import { LoginUseCase } from 'src/application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/application/use-cases/auth/register.use-case';
import { UseCasesModule } from 'src/application/use-cases/use-cases.module';
import { AdaptersModule } from 'src/infrastructure/adapters/adapters.module';

@Module({
  imports: [UseCasesModule, AdaptersModule],
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
  ],
  exports: [TOKENS.LOGIN_USE_CASE, TOKENS.REGISTER_USE_CASE],
})
export class ControllerModule {}
