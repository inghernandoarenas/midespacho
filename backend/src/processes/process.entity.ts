import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Attachment } from '../attachments/attachment.entity';

@Entity('processes')
export class Process {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  tipoProceso: string;

  @Column()
  estado: string;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'clienteId' })
  clienteId: string;

  @ManyToOne(() => Client, (client) => client.procesos)
  @JoinColumn({ name: 'clienteId' })
  cliente: Client;

  @OneToMany(() => Attachment, (attachment) => attachment.proceso)
  anexos: Attachment[];
}