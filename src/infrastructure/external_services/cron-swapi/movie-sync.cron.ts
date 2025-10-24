import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncMoviesUseCase } from '../../../application/use-cases/movies/sync-movies.usecase';
import { LoggerService } from '../../../infrastructure/config/logger/logger.service';
import { ResilienceService } from '../../common/resilience/resilience.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CronExecution } from 'src/infrastructure/persistence/entities/cron-execution.entity';

@Injectable()
export class MovieSyncCron {
  constructor(
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
    private readonly resilienceService: ResilienceService,
    private readonly logger: LoggerService,
    @InjectRepository(CronExecution)
    private readonly cronRepo: Repository<CronExecution>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMovieSync() {
    const today = new Date().toISOString().split('T')[0];
    const cronName = 'movie-sync';

    this.logger.log(
      `[CRON] Iniciando sincronización de películas (${today})`,
      'MovieSyncCron',
    );

    // Idempotencia persistente
    const alreadyExecuted = await this.cronRepo.findOne({
      where: { cronName, lastRunDate: today },
    });
    if (alreadyExecuted) {
      this.logger.warn(
        `[CRON] Ya se ejecutó la sincronización para ${today}. Omitiendo.`,
        'MovieSyncCron',
      );
      return;
    }

    try {
      const result = await this.resilienceService.executeWithResilience(
        async () => {
          return this.syncMoviesUseCase.execute();
        },
      );

      this.logger.log(
        `[CRON] Sincronización completada. Se sincronizaron ${result.count} películas.`,
        'MovieSyncCron',
      );

      // Registrar ejecución exitosa
      const record = this.cronRepo.create({ cronName, lastRunDate: today });
      await this.cronRepo.save(record);
    } catch (error) {
      this.logger.error(
        `[CRON] Falló la sincronización: ${error.message}`,
        error.stack,
        'MovieSyncCron',
      );
    }
  }
}
