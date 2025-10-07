import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { LoginUseCase } from '../../../../application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/application/use-cases/auth/register.use-case';
import { TOKENS } from '../../../../domain/tokens/tokens';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let registerUseCase: jest.Mocked<RegisterUseCase>;

  beforeEach(async () => {
    // Mock de las dependencias (UseCases)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: TOKENS.LOGIN_USE_CASE,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TOKENS.REGISTER_USE_CASE,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get(TOKENS.LOGIN_USE_CASE);
    registerUseCase = module.get(TOKENS.REGISTER_USE_CASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: register
  it('debería registrar un nuevo usuario correctamente', async () => {
    const body = { username: 'user1', password: 'pass123' };
    const expectedResult = { id: 1, username: 'user1', role: 'user' as 'user' };

    registerUseCase.execute.mockResolvedValue(expectedResult);

    const result = await controller.register(body);

    expect(registerUseCase.execute).toHaveBeenCalledWith('user1', 'pass123');
    expect(result).toEqual(expectedResult);
  });

  // 🔹 Test: login
  it('debería loguear un usuario y devolver un token', async () => {
    const body = { username: 'user1', password: 'pass123' };
    const expectedToken = {
      access_token: 'jwt.token.here',
      user: { id: 1, username: 'user1', role: 'user' as 'user' },
    };

    loginUseCase.execute.mockResolvedValue(expectedToken);

    const result = await controller.login(body);

    expect(loginUseCase.execute).toHaveBeenCalledWith('user1', 'pass123');
    expect(result).toEqual(expectedToken);
  });

  // Test: manejo de errores
  it('debería lanzar un error si el login falla', async () => {
    loginUseCase.execute.mockRejectedValue(new Error('Credenciales inválidas'));

    await expect(
      controller.login({ username: 'user1', password: 'wrong' }),
    ).rejects.toThrow('Credenciales inválidas');
  });
});
