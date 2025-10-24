import { Module } from '@nestjs/common';
import { UseCasesModule } from 'src/application/use-cases/use-cases.module';
import { LoggerModule } from 'src/infrastructure/config/logger/logger.module';
import { MovieSyncCron } from './movie-sync.cron';
import { SyncMoviesUseCase } from 'src/application/use-cases/movies/sync-movies.usecase';
import { CronExecution } from 'src/infrastructure/persistence/entities/cron-execution.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResilienceService } from 'src/infrastructure/common/resilience/resilience.service';

@Module({
  imports: [
    UseCasesModule,
    LoggerModule,
    TypeOrmModule.forFeature([CronExecution]),
  ],
  providers: [MovieSyncCron, SyncMoviesUseCase, ResilienceService],
  exports: [MovieSyncCron, SyncMoviesUseCase],
})
export class CronJobsModule {}
