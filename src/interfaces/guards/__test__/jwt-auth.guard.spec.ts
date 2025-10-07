import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(jwtService);
  });

  const mockExecutionContext = (headers: Record<string, string> = {}) =>
    ({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers }),
      }),
    }) as unknown as ExecutionContext;

  // Caso 1: token válido
  it('debería permitir acceso si el token es válido', () => {
    const decodedToken = { id: 1, username: 'user1' };
    jwtService.verify.mockReturnValue(decodedToken);

    const context = mockExecutionContext({
      authorization: 'Bearer valid.token',
    });

    const result = guard.canActivate(context);

    expect(jwtService.verify).toHaveBeenCalledWith('valid.token');
    expect(result).toBe(true);

    const request = context.switchToHttp().getRequest();
    expect(request.user).toEqual(decodedToken);
  });

  // Caso 2: token no proporcionado
  it('debería lanzar UnauthorizedException si no se envía el token', () => {
    const context = mockExecutionContext({});

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Token not provided'),
    );
  });

  // Caso 3: token inválido o expirado
  it('debería lanzar UnauthorizedException si el token es inválido', () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const context = mockExecutionContext({
      authorization: 'Bearer invalid.token',
    });

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });
});
