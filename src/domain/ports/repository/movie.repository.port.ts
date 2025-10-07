import { Movie } from 'src/domain/entities/movie.entity';

export interface MovieRepositoryPort {
  findAll(): Promise<Movie[]>;
  findById(id: string): Promise<Movie>;
  findByTitle(title: string, id: number): Promise<boolean>;
  create(movie: Movie): Promise<Movie>;
  update(movie: Movie): Promise<Movie>;
  delete(id: string): Promise<void>;
}
