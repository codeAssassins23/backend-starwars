import { Repository } from 'typeorm';
import { TypeormUserRepositoryAdapter } from '../repositories/user.repository.adapter';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../domain/entities/user.entity';

describe('TypeormUserRepositoryAdapter', () => {
  let adapter: TypeormUserRepositoryAdapter;
  let repo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(() => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    adapter = new TypeormUserRepositoryAdapter(repo as any);
  });

  afterEach(() => jest.clearAllMocks());

  // Caso 1: encontrar usuario por username
  it('debería retornar un usuario del dominio si existe en la base de datos', async () => {
    const mockEntity: UserEntity = {
      id: 1,
      username: 'user1',
      password: 'hashed123',
      role: 'admin',
    } as any;

    repo.findOne.mockResolvedValue(mockEntity);

    const result = await adapter.findByUsername('user1');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { username: 'user1' } });
    expect(result).toBeInstanceOf(User);
    expect(result?.username).toBe('user1');
    expect(result?.role).toBe('admin');
  });

  // Caso 2: usuario no encontrado
  it('debería retornar null si no existe el usuario', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await adapter.findByUsername('ghost');

    expect(result).toBeNull();
    expect(repo.findOne).toHaveBeenCalledWith({ where: { username: 'ghost' } });
  });

  // Caso 3: error inesperado en findByUsername
  it('debería propagar errores inesperados de findByUsername', async () => {
    repo.findOne.mockRejectedValue(new Error('DB Error'));

    await expect(adapter.findByUsername('user')).rejects.toThrow('DB Error');
  });

  // Caso 4: crear usuario correctamente
  it('debería crear un usuario y devolver una entidad de dominio', async () => {
    const mockUser = new User(1, 'user1', 'pass123', 'user');

    const mockEntity: UserEntity = {
      id: 1,
      username: 'user1',
      password: 'pass123',
      role: 'user',
    } as any;

    repo.save.mockResolvedValue(mockEntity);

    const result = await adapter.create(mockUser);

    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toBeInstanceOf(User);
    expect(result.username).toBe('user1');
    expect(result.role).toBe('user');
  });

  // Caso 5: error inesperado en create
  it('debería propagar errores inesperados en create', async () => {
    const user = new User(2, 'fail', 'error', 'user');
    repo.save.mockRejectedValue(new Error('Insert failed'));

    await expect(adapter.create(user)).rejects.toThrow('Insert failed');
  });
});
