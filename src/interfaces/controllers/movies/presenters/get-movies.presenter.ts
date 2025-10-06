import { ApiProperty } from '@nestjs/swagger';

export class MoviesResponsePresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  producer: string;

  @ApiProperty()
  releaseDate: string;

  constructor(response: MoviesResponsePresenter) {
    this.id = response.id;
    this.title = response.title;
    this.director = response.director;
    this.producer = response.producer;
    this.releaseDate = response.releaseDate;
  }
}
