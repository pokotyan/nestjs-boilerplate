import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('samples')
export class Sample {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sasage: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
