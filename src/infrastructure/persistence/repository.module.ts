import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TypeormUserRepositoryAdapter } from './repositories/user.repository.adapter';
import { TypeOrmModuleConfig } from '../config/typeorm/typeorm.module';
import { TypeormMovieRepositoryAdapter } from './repositories/movie.repository.adapter';
import { MovieEntity } from './entities/movie.entity';

@Module({
  imports: [
    TypeOrmModuleConfig,
    TypeOrmModule.forFeature([UserEntity, MovieEntity]),
  ],
  providers: [TypeormUserRepositoryAdapter, TypeormMovieRepositoryAdapter],
  exports: [
    TypeormUserRepositoryAdapter,
    TypeormMovieRepositoryAdapter,
    TypeOrmModule,
  ],
})
export class RepositoryModule {}
