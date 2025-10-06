import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/domain/tokens/tokens';
import { Movie } from 'src/domain/entities/movie.entity';
import type { MovieRepositoryPort } from 'src/domain/ports/repository/movie.repository.port';
import type { SwapiServicePort } from 'src/domain/ports/external_services/get-movies.swapi';

@Injectable()
export class SyncMoviesUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
    @Inject(TOKENS.SWAPI_SERVICE)
    private readonly swapiService: SwapiServicePort,
  ) {}

  async execute() {
    const swapiMovies = await this.swapiService.getMovies();
    const existingMovies = await this.movieRepo.findAll();

    for (const movie of swapiMovies) {
      const alreadyExists = existingMovies.find((m) => m.title === movie.title);
      if (!alreadyExists) {
        const newMovie = new Movie(
          0,
          movie.title,
          movie.director,
          movie.producer,
          movie.releaseDate,
        );
        await this.movieRepo.create(newMovie);
      }
    }

    return {
      message: 'Movies synced successfully',
      count: swapiMovies.length,
    };
  }
}
