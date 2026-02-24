import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card'; // 👈 FALTABA
import { RouterModule } from '@angular/router';
import { ProcessService, Process } from '../../../services/process.service';
import { ProcessFormComponent } from '../process-form/process-form.component';
import { ProcessDetailComponent } from '../process-detail/process-detail.component';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCardModule // 👈 AGREGADO
  ],
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css']
})
export class ProcessListComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'cliente', 'tipo', 'estado', 'fechas', 'acciones'];
  dataSource: Process[] = [];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private processService: ProcessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProcesses();
  }

  loadProcesses() {
    this.processService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource = response.data;
        this.totalItems = response.total;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar procesos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProcesses();
  }

  openDetail(process: Process) {
    this.dialog.open(ProcessDetailComponent, {
      width: '600px',
      data: process
    });
  }

  openAttachments(process: Process) {
    // TODO
  }

editProcess(process?: Process) {
  const dialogRef = this.dialog.open(ProcessFormComponent, {
    width: '600px',
    data: { process }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (process) {
        // Actualizar
        this.processService.update(process.id, result).subscribe({
          next: () => {
            this.snackBar.open('Proceso actualizado', 'Cerrar', { duration: 3000 });
            this.loadProcesses();
          },
          error: () => {
            this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo
        this.processService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Proceso creado', 'Cerrar', { duration: 3000 });
            this.loadProcesses();
          },
          error: () => {
            this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  });
}



  deleteProcess(id: string) {
    if (confirm('¿Está seguro de eliminar este proceso?')) {
      this.processService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Proceso eliminado', 'Cerrar', { duration: 3000 });
          this.loadProcesses();
        },
        error: () => {
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}