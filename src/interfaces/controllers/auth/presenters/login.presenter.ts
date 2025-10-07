import { ApiProperty } from '@nestjs/swagger';

class UserPresenter {
  @ApiProperty({ example: 1, description: 'ID del usuario autenticado' })
  id: number;

  @ApiProperty({ example: 'luke_skywalker', description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ example: 'user', description: 'Rol del usuario' })
  role: string;

  constructor(partial: UserPresenter) {
    Object.assign(this, partial);
  }
}

export class LoginResponsePresenter {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autenticación',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información básica del usuario autenticado',
    type: () => UserPresenter,
  })
  user: UserPresenter;

  constructor(response: LoginResponsePresenter) {
    this.access_token = response.access_token ?? '';
    this.user = new UserPresenter(response.user);
  }
}
