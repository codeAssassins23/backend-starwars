import { Inject, Injectable } from '@nestjs/common';
import type { MovieRepositoryPort } from 'src/domain/ports/repository/movie.repository.port';
import { TOKENS } from 'src/domain/tokens/tokens';

@Injectable()
export class GetMoviesUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}

  async execute() {
    return this.movieRepo.findAll();
  }
}
