import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}