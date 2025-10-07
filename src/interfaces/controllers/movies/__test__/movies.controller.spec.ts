import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { TOKENS } from '../../../../domain/tokens/tokens';
import { MoviesResponsePresenter } from '../presenters/get-movies.presenter';
import { MovieResponsePresenter } from '../presenters/movie.presenter';
import { MovieDto } from '../dto/movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  // Mocks de los casos de uso
  let getMoviesUseCase: any;
  let syncMoviesUseCase: any;
  let getMovieUseCase: any;
  let createMovieUseCase: any;
  let updateMovieUseCase: any;
  let deleteMovieUseCase: any;

  beforeEach(async () => {
    getMoviesUseCase = { execute: jest.fn() };
    syncMoviesUseCase = { execute: jest.fn() };
    getMovieUseCase = { execute: jest.fn() };
    createMovieUseCase = { execute: jest.fn() };
    updateMovieUseCase = { execute: jest.fn() };
    deleteMovieUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        { provide: TOKENS.GET_MOVIES_USE_CASE, useValue: getMoviesUseCase },
        { provide: TOKENS.SYNC_MOVIES_USE_CASE, useValue: syncMoviesUseCase },
        { provide: TOKENS.GET_MOVIE_USE_CASE, useValue: getMovieUseCase },
        { provide: TOKENS.CREATE_MOVIE_USE_CASE, useValue: createMovieUseCase },
        { provide: TOKENS.UPDATE_MOVIE_USE_CASE, useValue: updateMovieUseCase },
        { provide: TOKENS.DELETE_MOVIE_USE_CASE, useValue: deleteMovieUseCase },

        // 👇 Agrega estos mocks para los guards
        {
          provide: 'JwtAuthGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: 'RolesGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    })
      .overrideGuard(
        require('../../../../interfaces/guards/jwt-auth.guard').JwtAuthGuard,
      )
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(
        require('../../../../interfaces/guards/roles.guard').RolesGuard,
      )
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => jest.clearAllMocks());

  // Test 1: getAllMovies()
  it('debería obtener todas las películas correctamente', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'A New Hope',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        releaseDate: '1977-05-25',
      },
      {
        id: 2,
        title: 'The Empire Strikes Back',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
        releaseDate: '1980-05-21',
      },
    ];

    getMoviesUseCase.execute.mockResolvedValue(mockMovies);

    const result = await controller.getAllMovies();

    expect(getMoviesUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(
      mockMovies.map((m) => new MoviesResponsePresenter(m)),
    );
  });

  // Test 2: getAdminMovies()
  it('debería obtener una película por ID correctamente', async () => {
    const mockMovie = {
      id: 1,
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      releaseDate: '1977-05-25',
    };

    getMovieUseCase.execute.mockResolvedValue(mockMovie);

    const result = await controller.getAdminMovies('1');

    expect(getMovieUseCase.execute).toHaveBeenCalledWith('1');
    expect(result).toEqual(new MovieResponsePresenter(mockMovie));
  });

  // Test 3: createMovie()
  it('debería crear una nueva película correctamente', async () => {
    const body: MovieDto = {
      title: 'Return of the Jedi',
      director: 'Richard Marquand',
      producer: 'Howard Kazanjian',
      releaseDate: '1983-05-25',
    };

    const mockCreated = { id: 10, ...body };
    createMovieUseCase.execute.mockResolvedValue(mockCreated);

    const result = await controller.createMovie(body);

    expect(createMovieUseCase.execute).toHaveBeenCalledWith({
      id: 0,
      title: body.title,
      director: body.director,
      producer: body.producer,
      releaseDate: body.releaseDate,
    });
    expect(result).toEqual(new MovieResponsePresenter(mockCreated));
  });

  it('debería actualizar una película correctamente', async () => {
    const id = '5';
    const body: UpdateMovieDto = {
      title: 'Updated Title',
      director: 'George Lucas',
      producer: 'Rick McCallum',
      releaseDate: '2005-05-19',
    };
    const mockUpdated = {
      id: 5,
      title: 'Updated Title',
      director: 'George Lucas',
      producer: 'Rick McCallum',
      releaseDate: '2005-05-19',
    };

    updateMovieUseCase.execute.mockResolvedValue(mockUpdated);

    const result = await controller.updateMovie(id, body);

    expect(updateMovieUseCase.execute).toHaveBeenCalledWith(id, body);
    expect(result).toEqual(new MovieResponsePresenter(mockUpdated));
  });

  // Test 5: deleteMovie()
  it('debería eliminar una película correctamente', async () => {
    const id = '7';
    deleteMovieUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.deleteMovie(id);

    expect(deleteMovieUseCase.execute).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: 'Movie deleted successfully' });
  });

  // Test 6: syncMovies()
  it('debería sincronizar películas correctamente', async () => {
    const mockSync = { count: 5 };
    syncMoviesUseCase.execute.mockResolvedValue(mockSync);

    const result = await controller.syncMovies();

    expect(syncMoviesUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockSync);
  });
});
