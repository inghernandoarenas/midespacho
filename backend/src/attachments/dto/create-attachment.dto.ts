import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  tituloContextual: string;

  @IsString()
  @IsNotEmpty()
  descripcionContextual: string;

  @IsUUID()
  procesoId: string;
}