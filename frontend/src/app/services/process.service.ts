import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Process {
  id: string;
  titulo: string;
  descripcion: string;
  tipoProceso: string;
  estado: string;
  fechaInicio: string;
  fechaVencimiento: string;
  clienteId: string;
  createdAt?: string; // 👈 AGREGAR OPCIONAL
  cliente?: {
    id: string;
    nombre: string;
    email?: string;    // 👈 AGREGAR OPCIONAL
    telefono?: string; // 👈 AGREGAR OPCIONAL
  };
}

export interface ProcessResponse {
  data: Process[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private apiUrl = 'http://localhost:3000/processes';

  constructor(private http: HttpClient) {}

  getUpcoming(days: number = 7): Observable<Process[]> {
    return this.http.get<Process[]>(`${this.apiUrl}/upcoming?days=${days}`);
  }

  getAll(page: number = 1, limit: number = 10): Observable<ProcessResponse> {
    return this.http.get<ProcessResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getOne(id: string): Observable<Process> {
    return this.http.get<Process>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<Process> {
    return this.http.post<Process>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<Process> {
    return this.http.patch<Process>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}