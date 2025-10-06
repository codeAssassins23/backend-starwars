import { Controller, Get, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/interfaces/guards/jwt-auth.guard';
import { RolesGuard } from 'src/interfaces/guards/roles.guard';
import { Roles } from 'src/interfaces/decorators/roles.decorator';
import { TOKENS } from 'src/domain/tokens/tokens';
import { GetMoviesUseCase } from 'src/application/use-cases/movies/get-movies.usecase';
import { SyncMoviesUseCase } from 'src/application/use-cases/movies/sync-movies.usecase';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoviesController {
  constructor(
    @Inject(TOKENS.GET_MOVIES_USE_CASE)
    private readonly getMoviesUseCase: GetMoviesUseCase,
    @Inject(TOKENS.SYNC_MOVIES_USE_CASE)
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
  ) {}

  @Get()
  @Roles('user', 'admin')
  getAllMovies() {
    return this.getMoviesUseCase.execute();
  }

  @Post()
  @Roles('admin')
  createMovie(@Body() body: any) {
    return { message: `Movie ${body.title} created by admin` };
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async syncMovies() {
    return this.syncMoviesUseCase.execute();
  }
}
