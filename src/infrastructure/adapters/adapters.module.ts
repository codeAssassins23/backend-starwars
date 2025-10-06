import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceAdapter } from '../adapters/jwt/jwt.service.adapter';
import { BcryptServiceAdapter } from './encryption/bcrypt.service.adapter';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtServiceAdapter, BcryptServiceAdapter],
  exports: [JwtServiceAdapter, BcryptServiceAdapter, JwtModule],
})
export class AdaptersModule {}
