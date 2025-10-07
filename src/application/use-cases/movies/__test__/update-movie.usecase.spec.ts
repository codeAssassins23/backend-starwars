import { UpdateMovieUseCase } from '../update-movie.usecase';
import { Movie } from '../../../../domain/entities/movie.entity';

describe('UpdateMovieUseCase', () => {
  let useCase: UpdateMovieUseCase;
  let movieRepoMock: any;

  beforeEach(() => {
    movieRepoMock = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateMovieUseCase(movieRepoMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería actualizar los campos proporcionados de una película', async () => {
    const existingMovie = new Movie(
      1,
      'Old Title',
      'Old Dir',
      'Old Prod',
      '2000',
    );
    const updatedMovie = new Movie(
      1,
      'New Title',
      'Old Dir',
      'Old Prod',
      '2000',
    );
    const updateData = { title: 'New Title' };

    movieRepoMock.findById.mockResolvedValue(existingMovie);
    movieRepoMock.findByTitle.mockResolvedValue(false);
    movieRepoMock.update.mockResolvedValue(updatedMovie);

    const result = await useCase.execute('1', updateData);

    expect(movieRepoMock.findById).toHaveBeenCalledWith('1');
    expect(movieRepoMock.findByTitle).toHaveBeenCalledWith('New Title', 1);
    expect(movieRepoMock.update).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Title' }),
    );
    expect(result).toEqual(updatedMovie);
  });

  it('no debería sobrescribir campos con undefined', async () => {
    const existingMovie = new Movie(
      1,
      'Old Title',
      'Old Dir',
      'Old Prod',
      '2000',
    );
    const updateData = { title: undefined };

    movieRepoMock.findById.mockResolvedValue(existingMovie);
    movieRepoMock.findByTitle.mockResolvedValue(false);
    movieRepoMock.update.mockResolvedValue(existingMovie);

    const result = await useCase.execute('1', updateData);

    expect(movieRepoMock.findByTitle).toHaveBeenCalledWith('Old Title', 1);
    expect(result.title).toBe('Old Title');
  });

  it('debería propagar errores si ocurre un fallo en el repositorio', async () => {
    movieRepoMock.findById.mockRejectedValue(new Error('DB Error'));
    await expect(useCase.execute('1', {})).rejects.toThrow('DB Error');
  });
});
