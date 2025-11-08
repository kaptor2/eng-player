import { ENTITY_NAMES } from '@shared/registry';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: ENTITY_NAMES.desk })
export class DeskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  video!: string;

  @Column()
  start!: string;

  @Column()
  end!: string;

  @Column()
  sub!: string;
}