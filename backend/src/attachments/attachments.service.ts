import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
  ) {}

  async create(
    files: Express.Multer.File[],
    createAttachmentDto: CreateAttachmentDto,
  ): Promise<Attachment[]> {
    const attachments: Attachment[] = [];

    for (const file of files) {
      const attachment = this.attachmentsRepository.create({
        nombreArchivo: file.originalname,
        rutaArchivo: file.path,
        tipoArchivo: file.mimetype,
        tamano: file.size,
        tituloContextual: createAttachmentDto.tituloContextual,
        descripcionContextual: createAttachmentDto.descripcionContextual,
        procesoId: createAttachmentDto.procesoId,
      });
      attachments.push(await this.attachmentsRepository.save(attachment));
    }

    return attachments;
  }

  async findByProcess(procesoId: string): Promise<Attachment[]> {
    return this.attachmentsRepository.find({
      where: { procesoId },
      order: { fechaSubida: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentsRepository.findOne({
      where: { id },
      relations: ['proceso'],
    });
    if (!attachment) {
      throw new NotFoundException(`Anexo con ID ${id} no encontrado`);
    }
    return attachment;
  }

  async remove(id: string): Promise<void> {
    const attachment = await this.findOne(id);
    
    // Eliminar archivo físico
    try {
      if (fs.existsSync(attachment.rutaArchivo)) {
        fs.unlinkSync(attachment.rutaArchivo);
      }
    } catch (error) {
      console.error(`Error al eliminar archivo: ${error.message}`);
    }

    await this.attachmentsRepository.remove(attachment);
  }
}