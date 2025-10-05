import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EncryptionServicePort } from 'src/domain/ports/encryption.service.port';

@Injectable()
export class BcryptServiceAdapter implements EncryptionServicePort {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
