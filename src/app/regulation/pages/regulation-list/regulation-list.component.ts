import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { Regulation } from '../../models';
import { RegulationService } from '../../services/regulation.service';
import { RegulationEditModalComponent } from '../../components/regulation-edit-modal.component';

@Component({
  selector: 'app-regulation-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    RegulationEditModalComponent
  ],
  template: `
    <div class="p-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">Regulaciones</h1>
      </div>

      <p-table
        [value]="regulations"
        [tableStyle]="{ 'min-width': '50rem' }"
        [paginator]="true"
        [rows]="10"
        [globalFilterFields]="['code', 'title', 'description']"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="code">Código <p-sortIcon field="code"></p-sortIcon></th>
            <th pSortableColumn="title">Título <p-sortIcon field="title"></p-sortIcon></th>
            <th pSortableColumn="description">Descripción <p-sortIcon field="description"></p-sortIcon></th>
            <th>Tipo Monitoreo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-regulation>
          <tr>
            <td>{{ regulation.code }}</td>
            <td>{{ regulation.title }}</td>
            <td>{{ regulation.description }}</td>
            <td>{{ regulation.tipoMonitoreoId }}</td>
            <td>
              <span
                [ngClass]="{
                  'bg-green-100 text-green-800 px-2 py-1 rounded text-xs': regulation.status === 'active',
                  'bg-red-100 text-red-800 px-2 py-1 rounded text-xs': regulation.status === 'inactive'
                }"
              >
                {{ regulation.status === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <p-button
                icon="pi pi-pencil"
                [rounded]="true"
                [text]="true"
                (click)="editRegulation(regulation)"
              ></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <app-regulation-edit-modal
      [(visible)]="showEditModal"
      [regulation]="selectedRegulation"
      (saved)="onRegulationSaved($event)"
    ></app-regulation-edit-modal>
  `
})
export class RegulationListComponent implements OnInit {
  private regulationService = inject(RegulationService);

  regulations: Regulation[] = [];
  showEditModal: boolean = false;
  selectedRegulation: Regulation | null = null;

  ngOnInit() {
    this.loadRegulations();
  }

  loadRegulations() {
    this.regulations = this.regulationService.getRegulations();
  }

  editRegulation(regulation: Regulation) {
    this.selectedRegulation = regulation;
    this.showEditModal = true;
  }

  onRegulationSaved(regulation: Regulation) {
    const index = this.regulations.findIndex(r => r.id === regulation.id);
    if (index > -1) {
      this.regulations[index] = regulation;
    }
    this.showEditModal = false;
  }
}
