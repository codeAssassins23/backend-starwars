import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  const mockExecutionContext = (user?: any) =>
    ({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
      getHandler: jest.fn(),
    }) as unknown as ExecutionContext;

  // Caso 1: No hay roles requeridos → acceso permitido
  it('debería permitir acceso si no hay roles requeridos', () => {
    reflector.get.mockReturnValue(undefined);

    const context = mockExecutionContext({ role: 'user' });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.get).toHaveBeenCalled();
  });

  // Caso 2: Usuario con rol permitido → acceso permitido
  it('debería permitir acceso si el usuario tiene un rol válido', () => {
    reflector.get.mockReturnValue(['admin', 'user']);

    const context = mockExecutionContext({ role: 'admin' });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  // Caso 3: Usuario sin rol o no autorizado → ForbiddenException
  it('debería lanzar ForbiddenException si el usuario no tiene un rol permitido', () => {
    reflector.get.mockReturnValue(['admin']);

    const context = mockExecutionContext({ role: 'user' });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Access denied'),
    );
  });

  // Caso 4: Usuario no definido en la request → ForbiddenException
  it('debería lanzar ForbiddenException si no existe usuario en la request', () => {
    reflector.get.mockReturnValue(['admin']);

    const context = mockExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Access denied'),
    );
  });
});
