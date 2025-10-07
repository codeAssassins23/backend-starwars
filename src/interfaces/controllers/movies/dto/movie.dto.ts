import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  producer: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  releaseDate: string;
}
