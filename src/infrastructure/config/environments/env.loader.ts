import 'dotenv/config';
import * as fs from 'fs';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export async function loadSecrets(): Promise<{
  SECRET_ACCESS: string;
  JWT_SECRET: string;
}> {
  const isProd = process.env.NODE_ENV !== 'local';
  let secrets = { SECRET_ACCESS: '', JWT_SECRET: '' };

  if (isProd && process.env.AWS_REGION && process.env.SECRET_ID) {
    try {
      const client = new SecretsManagerClient({
        region: process.env.AWS_REGION,
      });
      const command = new GetSecretValueCommand({
        SecretId: process.env.SECRET_ID,
      });
      const response = await client.send(command);

      if (response.SecretString) {
        const parsed = JSON.parse(response.SecretString);
        secrets.SECRET_ACCESS = parsed.SECRET_ACCESS;
        secrets.JWT_SECRET = parsed.JWT_SECRET;
        console.log('Secrets cargados desde AWS Secrets Manager');
      } else {
        console.warn('SecretString vacío en AWS Secrets Manager');
      }
    } catch (err) {
      console.error(
        'Error obteniendo secretos de AWS:',
        (err as Error).message,
      );
      throw err;
    }
  } else if (fs.existsSync('.secrets.json')) {
    console.log('Cargando secretos desde .secrets.json');
    const file = fs.readFileSync('.secrets.json', 'utf-8');
    const parsed = JSON.parse(file);
    secrets.SECRET_ACCESS = parsed.SECRET_ACCESS;
    secrets.JWT_SECRET = parsed.JWT_SECRET;
  } else {
    console.log('Cargando secretos desde variables de entorno locales');
    secrets.SECRET_ACCESS = process.env.SECRET_ACCESS || '';
    secrets.JWT_SECRET = process.env.JWT_SECRET || '';
  }

  return secrets;
}
