import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SwapiServicePort } from 'src/domain/ports/external_services/get-movies.swapi';

@Injectable()
export class SwapiService implements SwapiServicePort {
  private readonly baseUrl = 'https://www.swapi.tech/api';

  async getMovies() {
    const response = await axios.get(`${this.baseUrl}/films`);
    return response.data.result.map((film: any) => ({
      title: film.properties.title,
      director: film.properties.director,
      producer: film.properties.producer,
      releaseDate: film.properties.release_date,
    }));
  }
}
