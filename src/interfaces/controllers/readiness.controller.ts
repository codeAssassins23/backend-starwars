import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';

@Controller('readiness')
export class ReadinessController {
  constructor(private readonly dataSource: DataSource) {}

  @SkipThrottle()
  @Get()
  async check() {
    const dbStatus = await this.checkDatabaseConnection();

    return {
      status: dbStatus ? 'ready' : 'not ready',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      // Verifica si la conexión de TypeORM está activa
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Ejecuta una consulta simple para confirmar conexión
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}
