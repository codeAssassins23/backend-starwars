import { Controller, Post, Body, Inject } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/application/use-cases/auth/register.use-case';
import { TOKENS } from 'src/domain/tokens/tokens';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TOKENS.LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCase,
    @Inject(TOKENS.REGISTER_USE_CASE)
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.registerUseCase.execute(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.loginUseCase.execute(body.username, body.password);
  }
}
