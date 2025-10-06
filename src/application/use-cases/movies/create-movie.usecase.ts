import { Inject, Injectable } from '@nestjs/common';
import { Movie } from '../../../domain/entities/movie.entity';
import type { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';
import { TOKENS } from '../../../domain/tokens/tokens';

@Injectable()
export class CreateMovieUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}
  async execute(movie: Movie) {
    await this.movieRepo.findByTitle(movie.title, movie.id);
    return await this.movieRepo.create(movie);
  }
}
