import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProcessService, Process } from '../../services/process.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <mat-icon>gavel</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500">Procesos Activos</p>
              <p class="text-2xl font-bold">{{ activeCount }}</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <mat-icon>warning</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500">Por Vencer (7 días)</p>
              <p class="text-2xl font-bold">{{ upcomingCount }}</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500">Finalizados</p>
              <p class="text-2xl font-bold">{{ completedCount }}</p>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Upcoming Processes Table -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Próximos Vencimientos</mat-card-title>
          <mat-card-subtitle>Procesos con fecha límite en los próximos 7 días</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="upcomingProcesses" class="w-full">
            
            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef>Proceso</th>
              <td mat-cell *matCellDef="let p">{{ p.titulo }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let p">{{ p.cliente?.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="fechaVencimiento">
              <th mat-header-cell *matHeaderCellDef>Vence</th>
              <td mat-cell *matCellDef="let p">{{ p.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p">
                <span class="px-2 py-1 rounded-full text-xs"
                  [class.bg-green-100]="p.estado === 'Activo'"
                  [class.bg-yellow-100]="p.estado === 'En espera'"
                  [class.text-green-800]="p.estado === 'Activo'"
                  [class.text-yellow-800]="p.estado === 'En espera'">
                  {{ p.estado }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button color="primary" [routerLink]="['/processes', p.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="upcomingProcesses.length === 0" class="text-center py-8 text-gray-500">
            No hay procesos por vencer en los próximos días
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Placeholder for future charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <mat-card class="p-4">
          <mat-card-header>
            <mat-card-title>Procesos por Tipo</mat-card-title>
          </mat-card-header>
          <mat-card-content class="h-64 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <mat-icon style="font-size: 48px;">pie_chart</mat-icon>
              <p>Gráfico próximo a implementar</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="p-4">
          <mat-card-header>
            <mat-card-title>Procesos por Estado</mat-card-title>
          </mat-card-header>
          <mat-card-content class="h-64 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <mat-icon style="font-size: 48px;">bar_chart</mat-icon>
              <p>Gráfico próximo a implementar</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  upcomingProcesses: Process[] = [];
  displayedColumns: string[] = ['titulo', 'cliente', 'fechaVencimiento', 'estado', 'acciones'];
  
  activeCount = 0;
  upcomingCount = 0;
  completedCount = 0;

  constructor(
    private processService: ProcessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    
    this.router.events.subscribe(() => {
      if (this.route.snapshot.routeConfig?.path === 'dashboard') {
        this.loadData();
      }
    });
  }

  loadData() {
    this.loadUpcoming();
    this.loadStats();
  }

  loadUpcoming() {
    this.processService.getUpcoming(7).subscribe({
      next: (data) => {
        this.upcomingProcesses = data;
      },
      error: (err) => console.error('Error loading upcoming processes', err)
    });
  }

  loadStats() {
    // Esto lo haremos después con un endpoint específico
    this.processService.getAll(1, 100).subscribe({
      next: (response) => {
        this.activeCount = response.data.filter(p => p.estado === 'Activo').length;
        this.completedCount = response.data.filter(p => p.estado === 'Finalizado').length;
      }
    });
  }
}