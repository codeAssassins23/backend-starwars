import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column({ default: true })
  status: boolean;

  @Column({ name: 'release_date' })
  releaseDate: string;
}
