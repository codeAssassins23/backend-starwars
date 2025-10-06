import { SyncMoviesUseCase } from '../sync-movies.usecase';
import { Movie } from '../../../../domain/entities/movie.entity';

describe('SyncMoviesUseCase', () => {
  let useCase: SyncMoviesUseCase;
  let movieRepoMock: any;
  let swapiServiceMock: any;

  beforeEach(() => {
    movieRepoMock = {
      findAll: jest.fn(),
      create: jest.fn(),
    };
    swapiServiceMock = {
      getMovies: jest.fn(),
    };
    useCase = new SyncMoviesUseCase(movieRepoMock, swapiServiceMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería sincronizar películas nuevas correctamente', async () => {
    const swapiMovies = [
      new Movie(0, 'A New Hope', 'George Lucas', 'Gary Kurtz', '1977'),
      new Movie(
        0,
        'Empire Strikes Back',
        'Irvin Kershner',
        'Gary Kurtz',
        '1980',
      ),
    ];
    const existingMovies = [
      new Movie(1, 'A New Hope', 'Lucas', 'Kurtz', '1977'),
    ];

    swapiServiceMock.getMovies.mockResolvedValue(swapiMovies);
    movieRepoMock.findAll.mockResolvedValue(existingMovies);
    movieRepoMock.create.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(swapiServiceMock.getMovies).toHaveBeenCalled();
    expect(movieRepoMock.findAll).toHaveBeenCalled();
    expect(movieRepoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Empire Strikes Back',
      }),
    );
    expect(result).toEqual({
      message: 'Movies synced successfully',
      count: 2,
    });
  });

  it('no debería crear películas que ya existen', async () => {
    const swapiMovies = [new Movie(0, 'A New Hope', 'Lucas', 'Kurtz', '1977')];
    const existingMovies = [
      new Movie(1, 'A New Hope', 'Lucas', 'Kurtz', '1977'),
    ];

    swapiServiceMock.getMovies.mockResolvedValue(swapiMovies);
    movieRepoMock.findAll.mockResolvedValue(existingMovies);

    const result = await useCase.execute();

    expect(movieRepoMock.create).not.toHaveBeenCalled();
    expect(result.count).toBe(1);
  });

  it('debería propagar errores si ocurre un fallo', async () => {
    swapiServiceMock.getMovies.mockRejectedValue(new Error('SWAPI down'));
    await expect(useCase.execute()).rejects.toThrow('SWAPI down');
  });
});
