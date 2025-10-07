import { Controller, Post, Body, Inject } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/auth/login.usecase';
import { RegisterUseCase } from '../../../application/use-cases/auth/register.use-case';
import { TOKENS } from '../../../domain/tokens/tokens';
import { ApiExtraModels } from '@nestjs/swagger';
import { LoginResponsePresenter } from './presenters/login.presenter';
import { RegisterResponsePresenter } from './presenters/register.presenter';
import { ApiResponseType } from 'src/infrastructure/config/swagger/response.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiExtraModels(LoginResponsePresenter, RegisterResponsePresenter)
export class AuthController {
  constructor(
    @Inject(TOKENS.LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCase,
    @Inject(TOKENS.REGISTER_USE_CASE)
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  @ApiResponseType(RegisterResponsePresenter, false)
  async register(@Body() body: RegisterDto) {
    const result = await this.registerUseCase.execute(
      body.username,
      body.password,
    );
    return new RegisterResponsePresenter({
      id: result.id,
      username: result.username,
      message: 'Usuario registrado exitosamente.',
    });
  }

  @Post('login')
  @ApiResponseType(LoginResponsePresenter, false)
  async login(@Body() body: LoginDto) {
    const result = await this.loginUseCase.execute(
      body.username,
      body.password,
    );
    return new LoginResponsePresenter({
      access_token: result.access_token,
      user: result.user,
    });
  }
}
