import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t px-6 py-3 text-center text-sm text-gray-500">
      © 2026 MiDespacho - Todos los derechos reservados
    </footer>
  `,
  styles: []
})
export class FooterComponent {}