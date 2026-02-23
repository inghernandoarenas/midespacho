import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  create(@Body() createProcessDto: CreateProcessDto) {
    return this.processesService.create(createProcessDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.processesService.findAll(+page, +limit);
  }

  @Get('upcoming')
  findUpcoming(@Query('days') days = 7) {
    return this.processesService.findUpcoming(+days);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProcessDto: UpdateProcessDto) {
    return this.processesService.update(id, updateProcessDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.processesService.remove(id);
  }
}