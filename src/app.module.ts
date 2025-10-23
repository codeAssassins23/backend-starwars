import { Module } from '@nestjs/common';
import { ControllerModule } from './interfaces/controllers/controllers.module';
import { LoggerModule } from './infrastructure/config/logger/logger.module';
import { TypeOrmModuleConfig } from './infrastructure/config/typeorm/typeorm.module';
import { RepositoryModule } from './infrastructure/persistence/repository.module';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';
import { CronJobsModule } from './infrastructure/external_services/cron-swapi/cron-jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 5,
      },
      {
        name: 'movies',
        ttl: 60000,
        limit: 200,
      },
    ]),
    ScheduleModule.forRoot(),
    ControllerModule,
    LoggerModule,
    TypeOrmModuleConfig,
    RepositoryModule,
    AdaptersModule,
    CronJobsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
