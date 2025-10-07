import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../login.usecase';
import { User } from '../../../../domain/entities/user.entity';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepoMock: any;
  let jwtServiceMock: any;
  let encryptionServiceMock: any;

  beforeEach(() => {
    userRepoMock = {
      findByUsername: jest.fn(),
    };
    jwtServiceMock = {
      sign: jest.fn(),
    };
    encryptionServiceMock = {
      compare: jest.fn(),
    };

    loginUseCase = new LoginUseCase(
      userRepoMock,
      jwtServiceMock,
      encryptionServiceMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
    userRepoMock.findByUsername.mockResolvedValue(null);

    await expect(loginUseCase.execute('notfound', 'password')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(userRepoMock.findByUsername).toHaveBeenCalledWith('notfound');
  });

  it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
    const fakeUser = new User(1, 'user1', 'hashedpass', 'user');
    userRepoMock.findByUsername.mockResolvedValue(fakeUser);
    encryptionServiceMock.compare.mockResolvedValue(false);

    await expect(loginUseCase.execute('user1', 'wrongpass')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(encryptionServiceMock.compare).toHaveBeenCalledWith(
      'wrongpass',
      'hashedpass',
    );
  });

  it('debería retornar token y datos del usuario si las credenciales son correctas', async () => {
    const fakeUser = new User(1, 'user1', 'hashedpass', 'admin');
    userRepoMock.findByUsername.mockResolvedValue(fakeUser);
    encryptionServiceMock.compare.mockResolvedValue(true);
    jwtServiceMock.sign.mockReturnValue('jwt.token.123');

    const result = await loginUseCase.execute('user1', 'password');

    expect(userRepoMock.findByUsername).toHaveBeenCalledWith('user1');
    expect(encryptionServiceMock.compare).toHaveBeenCalledWith(
      'password',
      'hashedpass',
    );
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: 1,
      role: 'admin',
    });
    expect(result).toEqual({
      access_token: 'jwt.token.123',
      user: { id: 1, username: 'user1', role: 'admin' },
    });
  });

  it('debería propagar cualquier otro error inesperado', async () => {
    userRepoMock.findByUsername.mockRejectedValue(new Error('DB Error'));

    await expect(loginUseCase.execute('user1', 'pass')).rejects.toThrow(
      'DB Error',
    );
  });
});
