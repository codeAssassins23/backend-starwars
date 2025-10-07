import { Inject, Injectable } from '@nestjs/common';
import type { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';
import { TOKENS } from '../../../domain/tokens/tokens';

@Injectable()
export class GetMoviesUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}

  async execute() {
    return await this.movieRepo.findAll();
  }
}
