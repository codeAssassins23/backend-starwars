import * as fs from 'fs';
import { loadSecrets } from '../env.loader';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

// Mock de módulos externos
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));
jest.mock('@aws-sdk/client-secrets-manager');

describe('loadSecrets', () => {
  const mockSend = jest.fn();
  const mockExistsSync = fs.existsSync as jest.MockedFunction<
    typeof fs.existsSync
  >;
  const mockReadFileSync = fs.readFileSync as jest.MockedFunction<
    typeof fs.readFileSync
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      NODE_ENV: 'local',
      AWS_REGION: 'us-east-1',
      SECRET_ID: 'my-secret-id',
      SECRET_ACCESS: '{"key":"value"}',
      JWT_SECRET: 'local-jwt',
    } as any;
  });

  // Caso 1: Carga desde AWS Secrets Manager
  it('debería cargar los secretos correctamente desde AWS Secrets Manager cuando no es local', async () => {
    process.env.NODE_ENV = 'production';

    // Mockeamos el comportamiento del cliente AWS
    (SecretsManagerClient as jest.Mock).mockReturnValue({
      send: mockSend,
    });

    const mockSecretString = JSON.stringify({
      SECRET_ACCESS: '{"DB_HOST":"localhost"}',
      JWT_SECRET: 'aws-secret',
    });

    mockSend.mockResolvedValue({ SecretString: mockSecretString });

    const result = await loadSecrets();

    expect(SecretsManagerClient).toHaveBeenCalledWith({ region: 'us-east-1' });
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    expect(result).toEqual({
      SECRET_ACCESS: '{"DB_HOST":"localhost"}',
      JWT_SECRET: 'aws-secret',
    });
  });

  // Caso 2: Error al obtener secretos de AWS
  it('debería lanzar un error si AWS Secrets Manager falla', async () => {
    process.env.NODE_ENV = 'production';

    (SecretsManagerClient as jest.Mock).mockReturnValue({
      send: mockSend,
    });

    mockSend.mockRejectedValue(new Error('AWS error'));

    await expect(loadSecrets()).rejects.toThrow('AWS error');
  });

  // Caso 3: Carga desde archivo .secrets.json
  it('debería cargar los secretos desde .secrets.json si existe el archivo', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        SECRET_ACCESS: '{"db":"file"}',
        JWT_SECRET: 'file-secret',
      }),
    );

    const result = await loadSecrets();

    expect(mockExistsSync).toHaveBeenCalledWith('.secrets.json');
    expect(result).toEqual({
      SECRET_ACCESS: '{"db":"file"}',
      JWT_SECRET: 'file-secret',
    });
  });

  // Caso 4: Carga desde variables de entorno locales
  it('debería cargar los secretos desde las variables de entorno si no hay archivo ni AWS', async () => {
    mockExistsSync.mockReturnValue(false);
    process.env.SECRET_ACCESS = '{"db":"env"}';
    process.env.JWT_SECRET = 'env-secret';

    const result = await loadSecrets();

    expect(result).toEqual({
      SECRET_ACCESS: '{"db":"env"}',
      JWT_SECRET: 'env-secret',
    });
  });
});
