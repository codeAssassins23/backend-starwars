import { Inject, Injectable } from '@nestjs/common';
import type { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';
import { TOKENS } from '../../../domain/tokens/tokens';

@Injectable()
export class DeleteMovieUseCase {
  constructor(
    @Inject(TOKENS.MOVIE_REPOSITORY)
    private readonly movieRepo: MovieRepositoryPort,
  ) {}
  async execute(id: string): Promise<void> {
    return await this.movieRepo.delete(id);
  }
}
