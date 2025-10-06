import { Module } from '@nestjs/common';
import { UseCasesModule } from 'src/application/use-cases/use-cases.module';
import { LoggerModule } from 'src/infrastructure/config/logger/logger.module';
import { MovieSyncCron } from './movie-sync.cron';
import { SyncMoviesUseCase } from 'src/application/use-cases/movies/sync-movies.usecase';

@Module({
  imports: [UseCasesModule, LoggerModule],
  providers: [MovieSyncCron, SyncMoviesUseCase],
  exports: [MovieSyncCron, SyncMoviesUseCase],
})
export class CronJobsModule {}
