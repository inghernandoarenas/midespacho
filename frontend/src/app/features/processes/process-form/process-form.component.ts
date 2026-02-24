import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientService, Client } from '../../../services/client.service';

@Component({
  selector: 'app-process-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.css']
})
export class ProcessFormComponent implements OnInit {
  processForm: FormGroup;
  clients: Client[] = [];
  tiposProceso = ['Laboral', 'Civil', 'Penal', 'Familiar', 'Comercial', 'Corporativo', 'Sucesoral', 'Administrativo'];
  estados = ['Activo', 'En espera', 'Finalizado', 'Cancelado'];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<ProcessFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      tipoProceso: ['', Validators.required],
      estado: ['Activo', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaVencimiento: [null],
      clienteId: ['', Validators.required]
    });

    // Si es edición, cargar datos
    if (data?.process) {
      this.processForm.patchValue({
        ...data.process,
        fechaInicio: new Date(data.process.fechaInicio),
        fechaVencimiento: data.process.fechaVencimiento ? new Date(data.process.fechaVencimiento) : null
      });
    }
  }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => console.error('Error loading clients', err)
    });
  }

  onSubmit() {
    if (this.processForm.valid) {
      this.dialogRef.close(this.processForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}