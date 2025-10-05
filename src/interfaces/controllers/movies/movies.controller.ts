import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/interfaces/guards/jwt-auth.guard';
import { RolesGuard } from 'src/interfaces/guards/roles.guard';
import { Roles } from 'src/interfaces/decorators/roles.decorator';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoviesController {
  @Get()
  @Roles('user', 'admin')
  getAllMovies() {
    return [{ id: 1, title: 'A New Hope' }];
  }

  @Post()
  @Roles('admin')
  createMovie(@Body() body: any) {
    return { message: `Movie ${body.title} created by admin` };
  }
}
