import { MovieSyncCron } from '../movie-sync.cron';
import { SyncMoviesUseCase } from '../../../../application/use-cases/movies/sync-movies.usecase';
import { LoggerService } from '../../../../infrastructure/config/logger/logger.service';

describe('MovieSyncCron', () => {
  let cron: MovieSyncCron;
  let mockSyncMoviesUseCase: jest.Mocked<SyncMoviesUseCase>;
  let mockLogger: jest.Mocked<LoggerService>;
  const RealDate = Date;

  beforeEach(() => {
    const fixedDate = new RealDate('2025-10-06T00:00:00Z');
    global.Date = jest.fn(() => fixedDate) as any;
    (global.Date as any).now = () => fixedDate.getTime();

    mockSyncMoviesUseCase = { execute: jest.fn() } as any;
    mockLogger = { log: jest.fn(), error: jest.fn() } as any;

    cron = new MovieSyncCron(mockSyncMoviesUseCase, mockLogger);
  });

  afterEach(() => {
    global.Date = RealDate;
    jest.restoreAllMocks();
  });

  // Caso 1: Ejecución exitosa del cron
  it('debería ejecutar la sincronización correctamente y registrar los logs', async () => {
    mockSyncMoviesUseCase.execute.mockResolvedValue({
      message: 'Movies synchronized successfully',
      count: 5,
    });

    await cron.handleDailyMovieSync();

    expect(mockLogger.log).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('[CRON] Starting daily movie sync at'),
      'MovieSyncCron',
    );
    expect(mockSyncMoviesUseCase.execute).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenNthCalledWith(
      2,
      '[CRON] Movie sync completed successfully. Synced 5 movies.',
      'MovieSyncCron',
    );
  });

  // Caso 2: Error durante la sincronización
  it('debería registrar un error si la sincronización falla', async () => {
    const fakeError = new Error('Network failure');
    fakeError.stack = 'stack trace here';
    mockSyncMoviesUseCase.execute.mockRejectedValue(fakeError);

    await cron.handleDailyMovieSync();

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('[CRON] Starting daily movie sync at'),
      'MovieSyncCron',
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[CRON] Movie sync failed: Network failure',
      'stack trace here',
      'MovieSyncCron',
    );
  });
});
