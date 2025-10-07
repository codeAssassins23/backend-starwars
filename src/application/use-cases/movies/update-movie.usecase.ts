import { Inject, Injectable } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import type { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';
import { TOKENS } from '../../../domain/tokens/tokens';

@Injectable()
export class UpdateMovieUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}
  async execute(id: string, data: Partial<Movie>): Promise<Movie> {
    const movie = await this.movieRepo.findById(id);
    await this.movieRepo.findByTitle(
      data.title ?? movie.title,
      parseInt(id, 10),
    );

    // Actualizar solo los campos proporcionados en data
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        movie[key] = data[key];
      }
    });
    const movieUpdate = await this.movieRepo.update(movie);
    return movieUpdate;
  }
}
