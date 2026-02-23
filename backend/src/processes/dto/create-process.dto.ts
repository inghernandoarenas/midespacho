import { IsString, IsOptional, IsDateString, IsUUID, IsIn } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  tipoProceso: string;

  @IsString()
  @IsIn(['Activo', 'En espera', 'Finalizado', 'Cancelado'])
  estado: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsUUID()
  clienteId: string;
}