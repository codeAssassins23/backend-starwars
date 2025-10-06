import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from '../register.use-case';
import { User } from '../../../../domain/entities/user.entity';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let userRepoMock: any;
  let encryptionServiceMock: any;

  beforeEach(() => {
    userRepoMock = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };
    encryptionServiceMock = {
      hash: jest.fn(),
    };

    registerUseCase = new RegisterUseCase(userRepoMock, encryptionServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar ConflictException si el usuario ya existe', async () => {
    userRepoMock.findByUsername.mockResolvedValue(
      new User(1, 'user1', 'hashedpass', 'admin'),
    );

    await expect(registerUseCase.execute('user1', '12345')).rejects.toThrow(
      ConflictException,
    );

    expect(userRepoMock.findByUsername).toHaveBeenCalledWith('user1');
    expect(encryptionServiceMock.hash).not.toHaveBeenCalled();
  });

  it('debería registrar un nuevo usuario correctamente', async () => {
    const mockHashedPassword = 'hashed123';
    const mockCreatedUser = new User(1, 'newuser', mockHashedPassword, 'admin');
    jest.spyOn(mockCreatedUser, 'toSafeUser').mockReturnValue({
      id: 1,
      username: 'newuser',
      role: 'admin',
    });

    userRepoMock.findByUsername.mockResolvedValue(null);
    encryptionServiceMock.hash.mockResolvedValue(mockHashedPassword);
    userRepoMock.create.mockResolvedValue(mockCreatedUser);

    const result = await registerUseCase.execute('newuser', 'pass123');

    expect(userRepoMock.findByUsername).toHaveBeenCalledWith('newuser');
    expect(encryptionServiceMock.hash).toHaveBeenCalledWith('pass123');
    expect(userRepoMock.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      username: 'newuser',
      role: 'admin',
    });
  });

  it('debería propagar errores inesperados del repositorio', async () => {
    userRepoMock.findByUsername.mockResolvedValue(null);
    encryptionServiceMock.hash.mockResolvedValue('hashed');
    userRepoMock.create.mockRejectedValue(new Error('DB error'));

    await expect(registerUseCase.execute('user', 'pass')).rejects.toThrow(
      'DB error',
    );
  });
});
