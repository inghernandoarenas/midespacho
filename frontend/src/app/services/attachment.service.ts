import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attachment {
  id: string;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoArchivo: string;
  tamano: number;
  tituloContextual: string;
  descripcionContextual: string;
  fechaSubida: string;
  procesoId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private apiUrl = 'http://localhost:3000/attachments';

  constructor(private http: HttpClient) {}

  getByProcess(procesoId: string): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/process/${procesoId}`);
  }

  upload(procesoId: string, files: File[], titulo: string, descripcion: string): Observable<Attachment[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('tituloContextual', titulo);
    formData.append('descripcionContextual', descripcion);
    
    return this.http.post<Attachment[]>(`${this.apiUrl}/upload/${procesoId}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}