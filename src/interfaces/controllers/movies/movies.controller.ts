import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Inject,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../interfaces/guards/jwt-auth.guard';
import { RolesGuard } from '../../../interfaces/guards/roles.guard';
import { Roles } from '../../../interfaces/decorators/roles.decorator';
import { TOKENS } from '../../../domain/tokens/tokens';
import { GetMoviesUseCase } from '../../../application/use-cases/movies/get-movies.usecase';
import { SyncMoviesUseCase } from '../../../application/use-cases/movies/sync-movies.usecase';
import { GetMovieUseCase } from '../../../application/use-cases/movies/get-movie.usecase';
import { MovieDto } from './dto/movie.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiResponseType } from '../../../infrastructure/config/swagger/response.decorator';
import { MovieResponsePresenter } from './presenters/movie.presenter';
import { MoviesResponsePresenter } from './presenters/get-movies.presenter';
import { CreateMovieUseCase } from '../../../application/use-cases/movies/create-movie.usecase';
import { UpdateMovieUseCase } from '../../../application/use-cases/movies/update-movie.usecase';
import { DeleteMovieUseCase } from '../../../application/use-cases/movies/delete-movie.usecase';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(MovieResponsePresenter, MoviesResponsePresenter)
export class MoviesController {
  constructor(
    @Inject(TOKENS.GET_MOVIES_USE_CASE)
    private readonly getMoviesUseCase: GetMoviesUseCase,
    @Inject(TOKENS.SYNC_MOVIES_USE_CASE)
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
    @Inject(TOKENS.GET_MOVIE_USE_CASE)
    private readonly getMovieUseCase: GetMovieUseCase,
    @Inject(TOKENS.CREATE_MOVIE_USE_CASE)
    private readonly createMovieUseCase: CreateMovieUseCase,
    @Inject(TOKENS.UPDATE_MOVIE_USE_CASE)
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    @Inject(TOKENS.DELETE_MOVIE_USE_CASE)
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Get()
  @Roles('user', 'admin')
  @ApiResponseType(MoviesResponsePresenter, true)
  async getAllMovies() {
    const movies = await this.getMoviesUseCase.execute();
    return movies.map((movie) => new MoviesResponsePresenter(movie));
  }

  @Get('/:id')
  @Roles('user', 'admin')
  @ApiResponseType(MovieResponsePresenter, false)
  async getAdminMovies(@Param('id') id: string) {
    const movie = await this.getMovieUseCase.execute(id);
    return new MovieResponsePresenter(movie);
  }

  @Post()
  @Roles('admin')
  @ApiResponseType(MovieResponsePresenter, false)
  async createMovie(@Body() body: MovieDto) {
    const movie = await this.createMovieUseCase.execute({
      title: body.title,
      director: body.director,
      producer: body.producer,
      releaseDate: body.releaseDate,
      id: 0,
    });
    return new MovieResponsePresenter(movie);
  }

  @Put('/:id')
  @Roles('admin')
  async updateMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    const movieUpdate = await this.updateMovieUseCase.execute(id, body);
    return new MovieResponsePresenter(movieUpdate);
  }

  @Delete('/:id')
  @Roles('admin')
  async deleteMovie(@Param('id') id: string) {
    await this.deleteMovieUseCase.execute(id);
    return { message: 'Movie deleted successfully' };
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async syncMovies() {
    return await this.syncMoviesUseCase.execute();
  }
}
