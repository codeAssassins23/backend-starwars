import 'dotenv/config';
import * as joi from 'joi';
import { IEnviroments } from 'src/domain/interfaces/enviroments.interface';
import { loadSecrets } from './env.loader';

let secretsCache: { SECRET_ACCESS: string; JWT_SECRET: string } | null = null;

async function getCachedSecrets() {
  if (!secretsCache) {
    secretsCache = await loadSecrets();
    console.log(' Secrets cargados y almacenados en memoria');
  }
  return secretsCache;
}

export async function getEnvConfig(): Promise<IEnviroments> {
  const baseSchema = joi
    .object({
      PORT: joi.number().required(),
      DATABASE_SSL: joi.boolean().required(),
      LOG_LEVEL: joi
        .string()
        .valid('info', 'debug', 'warn', 'error')
        .required(),
      SYNCHRONIZE: joi.boolean().required(),
      NODE_ENV: joi.string().required(),
      SWAPI_API_URL: joi.string().uri().required(),
    })
    .unknown(true);

  const { error: baseError, value: baseVars } = baseSchema.validate(
    process.env,
  );
  if (baseError)
    throw new Error(`Base config validation error: ${baseError.message}`);

  const secrets = await getCachedSecrets();

  if (!secrets.SECRET_ACCESS || !secrets.JWT_SECRET)
    throw new Error('SECRET_ACCESS o JWT_SECRET no encontrados');

  let secretAccess: Record<string, string>;
  try {
    secretAccess = JSON.parse(secrets.SECRET_ACCESS);
  } catch {
    throw new Error('SECRET_ACCESS no es un JSON válido');
  }

  const secretSchema = joi
    .object({
      'BDCONEXARETO.HOST': joi.string().required(),
      'BDCONEXARETO.PORT': joi.string().required(),
      'BDCONEXARETO.USER': joi.string().required(),
      'BDCONEXARETO.PASSWORD': joi.string().required(),
      'BDCONEXARETO.NAME': joi.string().required(),
    })
    .unknown(true);

  const { error: secretError, value: secretValid } =
    secretSchema.validate(secretAccess);

  if (secretError)
    throw new Error(`SECRET_ACCESS validation error: ${secretError.message}`);

  return {
    port: baseVars.PORT,
    nodeEnv: baseVars.NODE_ENV,
    logLevel: baseVars.logLevel || 'info',
    database: {
      host: secretValid['BDCONEXARETO.HOST'],
      port: Number(secretValid['BDCONEXARETO.PORT']),
      user: secretValid['BDCONEXARETO.USER'],
      password: secretValid['BDCONEXARETO.PASSWORD'],
      name: secretValid['BDCONEXARETO.NAME'],
      ssl: baseVars.DATABASE_SSL,
      synchronize: baseVars.SYNCHRONIZE,
    },
    swapiApiUrl: baseVars.SWAPI_API_URL,
    jwtSecret: secrets.JWT_SECRET,
  };
}

export function getEnvSync(): IEnviroments {
  if (!secretsCache) {
    throw new Error(
      'Los secretos aún no están cargados. Llama primero a await getEnvConfig() en main.ts',
    );
  }

  return {
    port: Number(process.env.PORT),
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
      host: JSON.parse(secretsCache.SECRET_ACCESS)['BDCONEXARETO.HOST'],
      port: Number(JSON.parse(secretsCache.SECRET_ACCESS)['BDCONEXARETO.PORT']),
      user: JSON.parse(secretsCache.SECRET_ACCESS)['BDCONEXARETO.USER'],
      password: JSON.parse(secretsCache.SECRET_ACCESS)['BDCONEXARETO.PASSWORD'],
      name: JSON.parse(secretsCache.SECRET_ACCESS)['BDCONEXARETO.NAME'],
      ssl: process.env.DATABASE_SSL === 'true',
      synchronize: process.env.SYNCHRONIZE === 'true',
    },
    swapiApiUrl: process.env.SWAPI_API_URL || '',
    jwtSecret: secretsCache.JWT_SECRET,
  };
}
