import 'dotenv/config';
import * as joi from 'joi';
import { IEnviroments } from 'src/domain/interfaces/enviroments.interface';

interface EnvVars {
  PORT: number;
  DATABASE_SSL: boolean;
  SYNCHRONIZE: boolean;
  NODE_ENV: string;
  SECRET_ACCESS: string;
  SWAPI_API_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_SSL: joi.boolean().required(),
    SYNCHRONIZE: joi.boolean().required(),
    NODE_ENV: joi.string().required(),
    SECRET_ACCESS: joi.string().required(),
    SWAPI_API_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

let secretAccessConfig: { [key: string]: string } = {};
try {
  secretAccessConfig = JSON.parse(envVars.SECRET_ACCESS);
} catch (jsonError) {
  throw new Error(
    'La variable SECRET_ACCESS no es un JSON válido. Por favor, revisa el formato.',
  );
}

const secretAccessSchema = joi
  .object({
    'BDCONEXARETO.HOST': joi.string().required(),
    'BDCONEXARETO.PORT': joi.string().required(),
    'BDCONEXARETO.USER': joi.string().required(),
    'BDCONEXARETO.PASSWORD': joi.string().required(),
    'BDCONEXARETO.NAME': joi.string().required(),
  })
  .unknown(true);

const { error: secretAccessError, value: secretAccessValidated } =
  secretAccessSchema.validate(secretAccessConfig);

if (secretAccessError) {
  throw new Error(
    `SECRET_ACCESS validation error: ${secretAccessError.message}`,
  );
}

export const envs: IEnviroments = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  database: {
    host: secretAccessValidated['BDCONEXARETO.HOST'],
    port: Number(secretAccessValidated['BDCONEXARETO.PORT']),
    user: secretAccessValidated['BDCONEXARETO.USER'],
    password: secretAccessValidated['BDCONEXARETO.PASSWORD'],
    name: secretAccessValidated['BDCONEXARETO.NAME'],
    ssl: envVars.DATABASE_SSL,
    synchronize: envVars.SYNCHRONIZE,
  },
  swapiApiUrl: envVars.SWAPI_API_URL,
};
