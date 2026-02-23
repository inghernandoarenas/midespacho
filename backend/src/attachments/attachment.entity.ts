import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Process } from '../processes/process.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombreArchivo: string;

  @Column()
  rutaArchivo: string;

  @Column()
  tipoArchivo: string;

  @Column()
  tamano: number;

  @Column()
  tituloContextual: string;

  @Column({ type: 'text' })
  descripcionContextual: string;

  @CreateDateColumn()
  fechaSubida: Date;

  @Column({ name: 'procesoId' })
  procesoId: string;

  @ManyToOne(() => Process, (process) => process.anexos)
  @JoinColumn({ name: 'procesoId' })
  proceso: Process;
}