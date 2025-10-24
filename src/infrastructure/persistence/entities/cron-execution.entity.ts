import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity('cron_executions')
@Unique(['cronName', 'lastRunDate'])
export class CronExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cron_name', type: 'varchar', length: 100 })
  cronName: string;

  @Column({ name: 'last_run_date', type: 'varchar', length: 20 })
  lastRunDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
