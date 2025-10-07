import { DeleteMovieUseCase } from '../delete-movie.usecase';

describe('DeleteMovieUseCase', () => {
  let useCase: DeleteMovieUseCase;
  let movieRepoMock: any;

  beforeEach(() => {
    movieRepoMock = {
      delete: jest.fn(),
    };
    useCase = new DeleteMovieUseCase(movieRepoMock);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería eliminar una película correctamente', async () => {
    movieRepoMock.delete.mockResolvedValue(undefined);

    await useCase.execute('1');

    expect(movieRepoMock.delete).toHaveBeenCalledWith('1');
  });

  it('debería propagar errores si el repositorio falla', async () => {
    movieRepoMock.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(useCase.execute('1')).rejects.toThrow('Delete failed');
  });
});
