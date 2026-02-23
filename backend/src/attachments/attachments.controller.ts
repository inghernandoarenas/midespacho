import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('upload/:procesoId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Tipo de archivo no permitido'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('procesoId') procesoId: string,
    @Body() createAttachmentDto: CreateAttachmentDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se subieron archivos');
    }

    createAttachmentDto.procesoId = procesoId;
    return this.attachmentsService.create(files, createAttachmentDto);
  }

  @Get('process/:procesoId')
  findByProcess(@Param('procesoId') procesoId: string) {
    return this.attachmentsService.findByProcess(procesoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.attachmentsService.remove(id);
  }
}