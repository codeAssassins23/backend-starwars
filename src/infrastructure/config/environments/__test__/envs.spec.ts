import { getEnvConfig, getEnvSync } from '../envs';
import { loadSecrets } from '../env.loader';
import { IEnviroments } from '../../../../domain/interfaces/enviroments.interface';

jest.mock('../env.loader', () => ({
  loadSecrets: jest.fn(),
}));

describe('Environment Config', () => {
  const mockedLoadSecrets = loadSecrets as jest.MockedFunction<
    typeof loadSecrets
  >;

  const mockSecrets = {
    SECRET_ACCESS: JSON.stringify({
      'BDCONEXARETO.HOST': 'localhost',
      'BDCONEXARETO.PORT': '5432',
      'BDCONEXARETO.USER': 'postgres',
      'BDCONEXARETO.PASSWORD': '12345',
      'BDCONEXARETO.NAME': 'starwars_db',
    }),
    JWT_SECRET: 'supersecretkey',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      PORT: '3000',
      DATABASE_SSL: 'true',
      SYNCHRONIZE: 'false',
      NODE_ENV: 'development',
      SWAPI_API_URL: 'https://www.swapi.tech/api',
    } as any;
    jest.resetModules();
  });

  // Caso exitoso
  it('debería cargar correctamente las variables de entorno y secretos', async () => {
    mockedLoadSecrets.mockResolvedValue(mockSecrets);

    const env: IEnviroments = await getEnvConfig();

    expect(mockedLoadSecrets).toHaveBeenCalled();
    expect(env).toMatchObject({
      port: 3000,
      nodeEnv: 'development',
      swapiApiUrl: 'https://www.swapi.tech/api',
      jwtSecret: 'supersecretkey',
      database: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '12345',
        name: 'starwars_db',
        ssl: true,
        synchronize: false,
      },
    });
  });

  // Error: Validación base fallida
  it('debería lanzar error si falta una variable base obligatoria', async () => {
    delete process.env.NODE_ENV;
    mockedLoadSecrets.mockResolvedValue(mockSecrets);

    await expect(getEnvConfig()).rejects.toThrow(
      /Base config validation error/,
    );
  });

  //Caso: getEnvSync sin llamar a getEnvConfig
  it('debería lanzar error si se llama a getEnvSync sin haber cargado los secretos', () => {
    jest.resetModules();
    const { getEnvSync: freshGetEnvSync } = require('../envs');

    expect(() => freshGetEnvSync()).toThrow(
      'Los secretos aún no están cargados. Llama primero a await getEnvConfig() en main.ts',
    );
  });

  //Caso: getEnvSync luego de cargar secretos
  it('debería retornar correctamente los valores desde getEnvSync', async () => {
    mockedLoadSecrets.mockResolvedValue(mockSecrets);
    await getEnvConfig();

    const result = getEnvSync();

    expect(result.port).toBe(3000);
    expect(result.database.host).toBe('localhost');
    expect(result.jwtSecret).toBe('supersecretkey');
  });
});
