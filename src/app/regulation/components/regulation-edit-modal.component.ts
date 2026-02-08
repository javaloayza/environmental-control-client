import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Regulation, MonitoringType } from '../models';
import { RegulationService } from '../services/regulation.service';

@Component({
  selector: 'app-regulation-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="'Editar Regulación'"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }">

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Código</label>
          <input
            pInputText
            [(ngModel)]="editingRegulation.code"
            class="w-full"
            placeholder="Código"
            readonly
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Título</label>
          <input
            pInputText
            [(ngModel)]="editingRegulation.title"
            class="w-full"
            placeholder="Título"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            [(ngModel)]="editingRegulation.description"
            class="w-full border rounded p-2"
            rows="4"
            placeholder="Descripción"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Monitoreo</label>
          <select
            [(ngModel)]="editingRegulation.tipoMonitoreoId"
            class="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar...</option>
            <option *ngFor="let type of monitoringTypes" [value]="type.id">
              {{ type.name_monitoring }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Empresa ID</label>
          <input
            pInputText
            [(ngModel)]="editingRegulation.companyId"
            class="w-full"
            placeholder="Company ID"
            readonly
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Estado</label>
          <select
            [(ngModel)]="editingRegulation.status"
            class="w-full border border-gray-300 rounded p-2"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          severity="secondary"
          (click)="cancel()"
        ></p-button>
        <p-button
          label="Guardar"
          (click)="save()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class RegulationEditModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<Regulation>();

  @Input() regulation: Regulation | null = null;

  editingRegulation: Regulation = this.getEmptyRegulation();
  monitoringTypes: MonitoringType[] = [];

  private regulationService = inject(RegulationService);

  ngOnInit() {
    this.monitoringTypes = this.regulationService.getMonitoringTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['regulation'] && this.regulation) {
      this.editingRegulation = { ...this.regulation };
    }
  }

  save() {
    this.regulationService.updateRegulation(this.editingRegulation).then((result: Regulation) => {
      this.saved.emit(result);
      this.visible = false;
      this.visibleChange.emit(false);
    });
  }

  cancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  private getEmptyRegulation(): Regulation {
    return {
      id: '',
      uid_regulation: '',
      tipoMonitoreoId: '',
      code: '',
      title: '',
      description: '',
      companyId: '',
      status: 'active'
    };
  }
}
