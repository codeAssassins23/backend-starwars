import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { TypeormMovieRepositoryAdapter } from '../repositories/movie.repository.adapter';
import { MovieEntity } from '../entities/movie.entity';
import { Movie } from '../../../domain/entities/movie.entity';

describe('TypeormMovieRepositoryAdapter', () => {
  let adapter: TypeormMovieRepositoryAdapter;
  let repo: jest.Mocked<Repository<MovieEntity>>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as any;

    adapter = new TypeormMovieRepositoryAdapter(repo as any);
  });

  afterEach(() => jest.clearAllMocks());

  // ✅ findAll
  it('debería devolver una lista de películas activas', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'A New Hope',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        releaseDate: '1977-05-25',
        status: true,
      },
      {
        id: 2,
        title: 'The Empire Strikes Back',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
        releaseDate: '1980-05-21',
        status: true,
      },
    ];
    repo.find.mockResolvedValue(mockMovies);

    const result = await adapter.findAll();

    expect(repo.find).toHaveBeenCalledWith({ where: { status: true } });
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Movie);
  });

  it('debería lanzar un error si falla el método findAll', async () => {
    repo.find.mockRejectedValue(new Error('DB Error'));
    await expect(adapter.findAll()).rejects.toThrow('DB Error');
  });

  // ✅ findById
  it('debería devolver una película por su id', async () => {
    const mockMovie = {
      id: 1,
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      releaseDate: '1977-05-25',
      status: true,
    };
    repo.findOneBy.mockResolvedValue(mockMovie);

    const result = await adapter.findById('1');

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, status: true });
    expect(result).toBeInstanceOf(Movie);
    expect(result.title).toBe('A New Hope');
  });

  it('debería lanzar NotFoundException si la película no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(adapter.findById('99')).rejects.toThrow(
      new NotFoundException('Movie not found'),
    );
  });

  it('debería propagar errores inesperados en findById', async () => {
    repo.findOneBy.mockRejectedValue(new Error('Unexpected error'));
    await expect(adapter.findById('1')).rejects.toThrow('Unexpected error');
  });

  // ✅ findByTitle
  it('debería devolver false si no hay conflicto en el título', async () => {
    repo.findOneBy.mockResolvedValue(null);
    const result = await adapter.findByTitle('A New Hope', 1);
    expect(result).toBe(false);
  });

  it('debería lanzar ConflictException si ya existe una película con el mismo título y distinto id', async () => {
    repo.findOneBy.mockResolvedValue({
      id: 2,
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      status: true,
      releaseDate: '1977-05-25',
    });
    await expect(adapter.findByTitle('A New Hope', 1)).rejects.toThrow(
      new ConflictException('Movie already exists'),
    );
  });

  it('debería propagar errores inesperados en findByTitle', async () => {
    repo.findOneBy.mockRejectedValue(new Error('DB Error'));
    await expect(adapter.findByTitle('Test', 1)).rejects.toThrow('DB Error');
  });

  // ✅ create
  it('debería crear una nueva película correctamente', async () => {
    const mockMovieEntity = {
      id: 1,
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      releaseDate: '1977-05-25',
      status: true,
    };
    repo.save.mockResolvedValue(mockMovieEntity);

    const result = await adapter.create(mockMovieEntity);

    expect(repo.save).toHaveBeenCalledWith(mockMovieEntity);
    expect(result).toBeInstanceOf(Movie);
    expect(result.id).toBe(1);
  });

  it('debería lanzar error si falla create', async () => {
    const movie = new Movie(
      1,
      'A New Hope',
      'George Lucas',
      'Gary Kurtz',
      '1977-05-25',
    );
    repo.save.mockRejectedValue(new Error('DB save failed'));
    await expect(adapter.create(movie)).rejects.toThrow('DB save failed');
  });

  // ✅ update
  it('debería actualizar una película correctamente', async () => {
    const movie = {
      id: 1,
      title: 'Updated',
      director: 'Director',
      producer: 'Producer',
      releaseDate: '2000-01-01',
      status: true,
    };
    repo.save.mockResolvedValue(movie);

    const result = await adapter.update(movie);

    expect(repo.save).toHaveBeenCalledWith(movie);
    expect(result.title).toBe('Updated');
  });

  it('debería lanzar error si falla update', async () => {
    const movie = new Movie(1, 'Test', 'Director', 'Producer', '2000-01-01');
    repo.save.mockRejectedValue(new Error('DB error'));
    await expect(adapter.update(movie)).rejects.toThrow('DB error');
  });

  // ✅ delete
  it('debería eliminar una película correctamente', async () => {
    const mockResult: UpdateResult = { affected: 1, raw: {} } as any;
    repo.update.mockResolvedValue(mockResult);

    await adapter.delete('1');

    expect(repo.update).toHaveBeenCalledWith(
      { id: 1, status: true },
      { status: false },
    );
  });

  it('debería lanzar NotFoundException si no se afecta ninguna fila al eliminar', async () => {
    const mockResult: UpdateResult = { affected: 0, raw: {} } as any;
    repo.update.mockResolvedValue(mockResult);

    await expect(adapter.delete('10')).rejects.toThrow(
      new NotFoundException('Movie not found'),
    );
  });

  it('debería propagar errores inesperados en delete', async () => {
    repo.update.mockRejectedValue(new Error('Unexpected error'));
    await expect(adapter.delete('5')).rejects.toThrow('Unexpected error');
  });
});
