import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    example: 'han_solo',
    description: 'Nombre de usuario que se registrará en el sistema',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    example: 'MillenniumFalcon123',
    description: 'Contraseña del nuevo usuario',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'La contraseña debe incluir al menos una mayúscula y un número.',
  })
  password: string;
}
