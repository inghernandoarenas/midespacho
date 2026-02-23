import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { Attachment } from './attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}