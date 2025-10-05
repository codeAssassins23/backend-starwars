// src/app.module.ts
import { Module } from '@nestjs/common';
import { ControllerModule } from './interfaces/controllers/controllers.module';
import { LoggerModule } from './infrastructure/config/logger/logger.module';
import { TypeOrmModuleConfig } from './infrastructure/config/typeorm/typeorm.module';
import { RepositoryModule } from './infrastructure/persistence/repository.module';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';

@Module({
  imports: [
    ControllerModule,
    LoggerModule,
    TypeOrmModuleConfig,
    RepositoryModule,
    AdaptersModule,
  ],
})
export class AppModule {}
