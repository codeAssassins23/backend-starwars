import { GetMovieUseCase } from '../get-movie.usecase';
import { Movie } from '../../../../domain/entities/movie.entity';

describe('GetMovieUseCase', () => {
  let useCase: GetMovieUseCase;
  let movieRepoMock: any;

  beforeEach(() => {
    movieRepoMock = {
      findById: jest.fn(),
    };
    useCase = new GetMovieUseCase(movieRepoMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería retornar una película cuando existe', async () => {
    const mockMovie = new Movie(
      1,
      'A New Hope',
      'Lucas',
      'Kurtz',
      '1977-05-25',
    );
    movieRepoMock.findById.mockResolvedValue(mockMovie);

    const result = await useCase.execute('1');

    expect(movieRepoMock.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockMovie);
  });

  it('debería propagar errores si el repositorio lanza una excepción', async () => {
    movieRepoMock.findById.mockRejectedValue(new Error('Not found'));

    await expect(useCase.execute('999')).rejects.toThrow('Not found');
  });
});
