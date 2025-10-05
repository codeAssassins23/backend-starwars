import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TypeormUserRepositoryAdapter } from './repositories/user.repository.adapter';
import { TypeOrmModuleConfig } from '../config/typeorm/typeorm.module';

@Module({
  imports: [TypeOrmModuleConfig, TypeOrmModule.forFeature([UserEntity])],
  providers: [TypeormUserRepositoryAdapter],
  exports: [TypeormUserRepositoryAdapter, TypeOrmModule],
})
export class RepositoryModule {}
