import { JwtService } from '@nestjs/jwt';
import { JwtServiceAdapter } from '../jwt.service.adapter';

describe('JwtServiceAdapter', () => {
  let adapter: JwtServiceAdapter;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    adapter = new JwtServiceAdapter(mockJwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('sign', () => {
    it('debería firmar correctamente un payload', () => {
      const payload = { userId: 1 };
      mockJwtService.sign.mockReturnValue('signed.jwt.token');

      const result = adapter.sign(payload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe('signed.jwt.token');
    });

    it('debería propagar un error si jwtService.sign falla', () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Error al firmar');
      });

      expect(() => adapter.sign({})).toThrow('Error al firmar');
    });
  });

  describe('verify', () => {
    it('debería verificar correctamente un token', () => {
      mockJwtService.verify.mockReturnValue({ userId: 1 });

      const result = adapter.verify('token123');

      expect(mockJwtService.verify).toHaveBeenCalledWith('token123');
      expect(result).toEqual({ userId: 1 });
    });

    it('debería propagar un error si jwtService.verify falla', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      expect(() => adapter.verify('token123')).toThrow('Token inválido');
    });
  });
});
