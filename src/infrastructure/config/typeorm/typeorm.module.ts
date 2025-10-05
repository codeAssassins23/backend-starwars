import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { envs } from '../environments/envs';

export const getTypeOrmDefaultModuleOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: envs.database.host,
  port: envs.database.port,
  username: envs.database.user,
  password: envs.database.password,
  database: envs.database.name,
  entities: [__dirname + '/../../persistence/entities/*.entity{.ts,.js}'],
  synchronize: envs.database.synchronize,
  ssl: {
    rejectUnauthorized: envs.database.ssl,
  },
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: getTypeOrmDefaultModuleOptions,
    }),
  ],
})
export class TypeOrmModuleConfig {}
