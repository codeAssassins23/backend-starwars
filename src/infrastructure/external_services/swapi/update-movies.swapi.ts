import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Movie } from 'src/domain/entities/movie.entity';
import { SwapiServicePort } from 'src/domain/ports/external_services/get-movies.swapi';
import { envs } from 'src/infrastructure/config/environments/envs';

@Injectable()
export class SwapiService implements SwapiServicePort {
  private readonly baseUrl = envs.swapiApiUrl;

  async getMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/films`);
      return response.data.result.map((film: any) => ({
        title: film.properties.title,
        director: film.properties.director,
        producer: film.properties.producer,
        releaseDate: film.properties.release_date,
      }));
    } catch (error) {
      throw new Error(
        'Error fetching movies from SWAPI: ' + (error as Error).message,
      );
    }
  }
}
