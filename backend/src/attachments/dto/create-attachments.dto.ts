import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttachmentDto } from './create-attachment.dto';

export class CreateAttachmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentDto)
  attachments: CreateAttachmentDto[];
}