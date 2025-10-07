import axios from 'axios';
import { envs } from '../../../../infrastructure/config/environments/envs';
import { SwapiService } from '../update-movies.swapi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SwapiService', () => {
  let service: SwapiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SwapiService();
    (envs as any).swapiApiUrl = 'https://www.swapi.tech/api';
  });

  // Caso 1: llamada exitosa a SWAPI
  it('debería retornar una lista de películas correctamente formateadas', async () => {
    const mockResponse = {
      data: {
        result: [
          {
            properties: {
              title: 'A New Hope',
              director: 'George Lucas',
              producer: 'Gary Kurtz',
              release_date: '1977-05-25',
            },
          },
          {
            properties: {
              title: 'The Empire Strikes Back',
              director: 'Irvin Kershner',
              producer: 'Gary Kurtz',
              release_date: '1980-05-21',
            },
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.getMovies();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://www.swapi.tech/api/films',
    );
    expect(result).toEqual([
      {
        title: 'A New Hope',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        releaseDate: '1977-05-25',
      },
      {
        title: 'The Empire Strikes Back',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
        releaseDate: '1980-05-21',
      },
    ]);
  });

  // Caso 2: error en la llamada a SWAPI
  it('debería lanzar un error si la llamada a SWAPI falla', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(service.getMovies()).rejects.toThrow(
      'Error fetching movies from SWAPI: Network Error',
    );
  });
});
