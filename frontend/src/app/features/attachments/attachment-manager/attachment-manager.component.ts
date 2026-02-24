import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AttachmentService, Attachment } from '../../../services/attachment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip'; 

@Component({
  selector: 'app-attachment-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatFormFieldModule, 
    MatInputModule,    
    MatTooltipModule   
  ],
  templateUrl: './attachment-manager.component.html',
  styleUrls: ['./attachment-manager.component.css']
})
export class AttachmentManagerComponent implements OnInit {
  uploadForm: FormGroup;
  attachments: Attachment[] = [];
  displayedColumns: string[] = ['nombre', 'titulo', 'fecha', 'tamano', 'acciones'];
  selectedFiles: File[] = [];
  uploading = false;
  procesoId: string;

  constructor(
    private fb: FormBuilder,
    private attachmentService: AttachmentService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AttachmentManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { procesoId: string, procesoTitulo: string }
  ) {
    this.procesoId = data.procesoId;
    this.uploadForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAttachments();
  }

  loadAttachments() {
    this.attachmentService.getByProcess(this.procesoId).subscribe({
      next: (data) => {
        this.attachments = data;
      },
      error: () => {
        this.snackBar.open('Error al cargar anexos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFiles() {
    if (this.uploadForm.valid && this.selectedFiles.length > 0) {
      this.uploading = true;
      const { titulo, descripcion } = this.uploadForm.value;
      
      this.attachmentService.upload(this.procesoId, this.selectedFiles, titulo, descripcion).subscribe({
        next: () => {
          this.uploading = false;
          this.snackBar.open('Archivos subidos exitosamente', 'Cerrar', { duration: 3000 });
          this.uploadForm.reset();
          this.selectedFiles = [];
          this.loadAttachments();
        },
        error: () => {
          this.uploading = false;
          this.snackBar.open('Error al subir archivos', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  deleteAttachment(id: string) {
    if (confirm('¿Está seguro de eliminar este anexo?')) {
      this.attachmentService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Anexo eliminado', 'Cerrar', { duration: 3000 });
          this.loadAttachments();
        },
        error: () => {
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}