import { GetMoviesUseCase } from '../get-movies.usecase';
import { Movie } from '../../../../domain/entities/movie.entity';

describe('GetMoviesUseCase', () => {
  let useCase: GetMoviesUseCase;
  let movieRepoMock: any;

  beforeEach(() => {
    movieRepoMock = {
      findAll: jest.fn(),
    };
    useCase = new GetMoviesUseCase(movieRepoMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería retornar una lista de películas', async () => {
    const mockMovies = [
      new Movie(1, 'A New Hope', 'Lucas', 'Kurtz', '1977'),
      new Movie(2, 'Empire Strikes Back', 'Irvin', 'Kershner', '1980'),
    ];
    movieRepoMock.findAll.mockResolvedValue(mockMovies);

    const result = await useCase.execute();

    expect(movieRepoMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockMovies);
  });

  it('debería propagar errores si el repositorio lanza una excepción', async () => {
    movieRepoMock.findAll.mockRejectedValue(new Error('DB failure'));

    await expect(useCase.execute()).rejects.toThrow('DB failure');
  });
});
