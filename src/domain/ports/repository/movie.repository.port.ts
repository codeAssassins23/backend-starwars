import { Movie } from 'src/domain/entities/movie.entity';

export interface MovieRepositoryPort {
  findAll(): Promise<Movie[]>;
  create(movie: Movie): Promise<Movie>;
}
