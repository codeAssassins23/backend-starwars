import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponsePresenter {
  @ApiProperty({
    example: 1,
    description: 'ID asignado al nuevo usuario',
  })
  id: number;

  @ApiProperty({
    example: 'han_solo',
    description: 'Nombre de usuario registrado',
  })
  username: string;

  @ApiProperty({
    example: 'Usuario registrado exitosamente.',
    description: 'Mensaje de confirmación del registro',
  })
  message: string;

  constructor(data: Partial<RegisterResponsePresenter>) {
    Object.assign(this, data);
  }
}
