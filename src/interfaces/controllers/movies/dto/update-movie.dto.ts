import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  director: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  producer: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  releaseDate: string;
}
