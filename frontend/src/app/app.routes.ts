import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { UnderConstructionComponent } from './shared/placeholders/under-construction/under-construction.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'processes', 
        loadComponent: () => import('./features/processes/process-list/process-list.component').then(m => m.ProcessListComponent) 
      },
      { path: 'clients', component: UnderConstructionComponent },
      { path: 'billing', component: UnderConstructionComponent },
      { path: 'settings', component: UnderConstructionComponent },
    ]
  }
];