import { CreateMovieUseCase } from '../create-movie.usecase';
import { Movie } from '../../../../domain/entities/movie.entity';

describe('CreateMovieUseCase', () => {
  let useCase: CreateMovieUseCase;
  let movieRepoMock: any;

  beforeEach(() => {
    movieRepoMock = {
      findByTitle: jest.fn(),
      create: jest.fn(),
    };

    useCase = new CreateMovieUseCase(movieRepoMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear una película correctamente después de validar el título', async () => {
    const newMovie = new Movie(0, 'A New Hope', 'Lucas', 'Kurtz', '1977-05-25');

    movieRepoMock.findByTitle.mockResolvedValue(false);
    movieRepoMock.create.mockResolvedValue({ ...newMovie, id: 1 });

    const result = await useCase.execute(newMovie);

    expect(movieRepoMock.findByTitle).toHaveBeenCalledWith('A New Hope', 0);
    expect(movieRepoMock.create).toHaveBeenCalledWith(newMovie);
    expect(result).toEqual({ ...newMovie, id: 1 });
  });

  it('debería propagar errores si el repositorio falla', async () => {
    const movie = new Movie(0, 'Error Movie', 'Lucas', 'Kurtz', '1977');
    movieRepoMock.findByTitle.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(movie)).rejects.toThrow('DB error');
  });
});
