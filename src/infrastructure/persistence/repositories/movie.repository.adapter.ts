import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryPort } from '../../../domain/ports/repository/movie.repository.port';

@Injectable()
export class TypeormMovieRepositoryAdapter implements MovieRepositoryPort {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<Movie[]> {
    try {
      const movies = await this.movieRepo.find({
        where: { status: true },
      });
      return movies.map(
        (m) => new Movie(m.id, m.title, m.director, m.producer, m.releaseDate),
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Movie> {
    try {
      const movie = await this.movieRepo.findOneBy({
        id: parseInt(id, 10),
        status: true,
      });
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
      return new Movie(
        movie.id,
        movie.title,
        movie.director,
        movie.producer,
        movie.releaseDate,
      );
    } catch (error) {
      throw error;
    }
  }

  async findByTitle(title: string, id: number): Promise<boolean> {
    try {
      const movie = await this.movieRepo.findOneBy({ title, status: true });
      if (movie && movie.id !== id) {
        throw new ConflictException('Movie already exists');
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async create(movie: Movie): Promise<Movie> {
    try {
      const saved = await this.movieRepo.save(movie);
      return new Movie(
        saved.id,
        saved.title,
        saved.director,
        saved.producer,
        saved.releaseDate,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(movie: Movie): Promise<Movie> {
    try {
      const updateMovie = await this.movieRepo.save(movie);
      return new Movie(
        updateMovie.id,
        updateMovie.title,
        updateMovie.director,
        updateMovie.producer,
        updateMovie.releaseDate,
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.movieRepo.update(
        { id: parseInt(id, 10), status: true },
        { status: false },
      );
      if (result.affected === 0) {
        throw new NotFoundException('Movie not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
