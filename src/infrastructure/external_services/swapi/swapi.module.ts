import { Module } from '@nestjs/common';
import { SwapiService } from './update-movies.swapi';

@Module({
  imports: [],
  providers: [SwapiService],
  exports: [SwapiService],
})
export class ExternalServicesModule {}
