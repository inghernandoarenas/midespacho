import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Process } from '../processes/process.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @OneToMany(() => Process, (process) => process.cliente)
  procesos: Process[];
}