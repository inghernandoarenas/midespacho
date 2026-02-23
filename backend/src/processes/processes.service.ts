import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process } from './process.entity';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processesRepository: Repository<Process>,
  ) {}

  async create(createProcessDto: CreateProcessDto): Promise<Process> {
    const process = this.processesRepository.create({
      ...createProcessDto,
      fechaInicio: new Date(createProcessDto.fechaInicio),
      fechaVencimiento: createProcessDto.fechaVencimiento 
        ? new Date(createProcessDto.fechaVencimiento) 
        : null,
    });
    return this.processesRepository.save(process);
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Process[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.processesRepository.findAndCount({
      relations: ['cliente'],
      order: { fechaInicio: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Process> {
    const process = await this.processesRepository.findOne({
      where: { id },
      relations: ['cliente', 'anexos'],
    });
    if (!process) {
      throw new NotFoundException(`Proceso con ID ${id} no encontrado`);
    }
    return process;
  }

async findUpcoming(days = 7): Promise<Process[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  return this.processesRepository
    .createQueryBuilder('process')
    .leftJoinAndSelect('process.cliente', 'cliente')
    .where('process.fechaVencimiento IS NOT NULL')
    .andWhere('process.fechaVencimiento BETWEEN :today AND :futureDate', {
      today,
      futureDate,
    })
    .orderBy('process.fechaVencimiento', 'ASC')
    .getMany();
}

  async update(id: string, updateProcessDto: UpdateProcessDto): Promise<Process> {
    const process = await this.findOne(id);
    
    const updateData: any = { ...updateProcessDto };
    if (updateProcessDto.fechaInicio) {
      updateData.fechaInicio = new Date(updateProcessDto.fechaInicio);
    }
    if (updateProcessDto.fechaVencimiento) {
      updateData.fechaVencimiento = new Date(updateProcessDto.fechaVencimiento);
    }

    Object.assign(process, updateData);
    return this.processesRepository.save(process);
  }

  async remove(id: string): Promise<void> {
    const process = await this.findOne(id);
    await this.processesRepository.remove(process);
  }
}