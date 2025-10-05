import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtServicePort } from '../../../domain/ports/jwt.service.port';

@Injectable()
export class JwtServiceAdapter implements JwtServicePort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): any {
    return this.jwtService.verify(token);
  }
}
