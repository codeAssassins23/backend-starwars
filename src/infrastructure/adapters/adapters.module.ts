import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceAdapter } from '../adapters/jwt/jwt.service.adapter';
import { BcryptServiceAdapter } from './encryption/bcrypt.service.adapter';
import { getEnvConfig } from '../config/environments/envs';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const envs = await getEnvConfig();
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [JwtServiceAdapter, BcryptServiceAdapter],
  exports: [JwtServiceAdapter, BcryptServiceAdapter, JwtModule],
})
export class AdaptersModule {}
