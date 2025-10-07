import * as bcrypt from 'bcrypt';
import { BcryptServiceAdapter } from '../bcrypt.service.adapter';

jest.mock('bcrypt');

describe('BcryptServiceAdapter', () => {
  let service: BcryptServiceAdapter;

  beforeEach(() => {
    service = new BcryptServiceAdapter();
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('debería llamar a bcrypt.hash con el password y salt rounds = 10', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed123');

      const result = await service.hash('myPassword');

      expect(hashSpy).toHaveBeenCalledWith('myPassword', 10);
      expect(result).toBe('hashed123');
    });

    it('debería propagar errores de bcrypt.hash', async () => {
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hash failed'));

      await expect(service.hash('fail')).rejects.toThrow('Hash failed');
    });
  });

  describe('compare', () => {
    it('debería retornar true si las contraseñas coinciden', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.compare('plain123', 'hashed123');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain123', 'hashed123');
      expect(result).toBe(true);
    });

    it('debería retornar false si las contraseñas no coinciden', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.compare('wrong', 'hashed123');

      expect(result).toBe(false);
    });

    it('debería propagar errores de bcrypt.compare', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockRejectedValue(new Error('Compare failed'));

      await expect(service.compare('plain', 'hash')).rejects.toThrow(
        'Compare failed',
      );
    });
  });
});
