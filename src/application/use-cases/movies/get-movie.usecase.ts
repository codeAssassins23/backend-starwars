import { Inject, Injectable } from '@nestjs/common';
import type { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';
import { TOKENS } from '../../../domain/tokens/tokens';

@Injectable()
export class GetMovieUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}
  async execute(id: string) {
    const movie = await this.movieRepo.findById(id);

    return movie;
  }
}
