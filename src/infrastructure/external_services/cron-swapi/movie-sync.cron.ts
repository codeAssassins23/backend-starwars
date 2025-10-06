import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncMoviesUseCase } from 'src/application/use-cases/movies/sync-movies.usecase';
import { LoggerService } from 'src/infrastructure/config/logger/logger.service';

@Injectable()
export class MovieSyncCron {
  constructor(
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Ejecuta la sincronización todos los días a medianoche (hora del servidor)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMovieSync() {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `🎬 [CRON] Starting daily movie sync at ${timestamp}`,
      'MovieSyncCron',
    );

    try {
      const result = await this.syncMoviesUseCase.execute();
      this.logger.log(
        `✅ [CRON] Movie sync completed successfully. Synced ${result.count} movies.`,
        'MovieSyncCron',
      );
    } catch (error) {
      this.logger.error(
        `❌ [CRON] Movie sync failed: ${error.message}`,
        error.stack,
        'MovieSyncCron',
      );
    }
  }
}
