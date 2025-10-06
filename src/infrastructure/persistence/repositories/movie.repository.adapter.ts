import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { Movie } from 'src/domain/entities/movie.entity';
import { MovieRepositoryPort } from 'src/domain/ports/repository/movie.repository.port';

@Injectable()
export class TypeormMovieRepositoryAdapter implements MovieRepositoryPort {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<Movie[]> {
    const movies = await this.movieRepo.find();
    return movies.map(
      (m) => new Movie(m.id, m.title, m.director, m.producer, m.releaseDate),
    );
  }

  async create(movie: Movie): Promise<Movie> {
    const saved = await this.movieRepo.save(movie);
    return new Movie(
      saved.id,
      saved.title,
      saved.director,
      saved.producer,
      saved.releaseDate,
    );
  }
}
