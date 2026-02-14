import { Component, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { MonitoringType } from 'app/monitoring-type/models/monitoring-type';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ModalMonitoringTypeFormComponent } from "app/monitoring-type/components";
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { MonitoringTypeService } from 'app/monitoring-type/services';
import { CompanyService } from 'app/company/services/company.service';

@Component({
  selector: 'app-monitoring-type-list',
  templateUrl: './monitoring-type-list.component.html',
  styleUrls: ['./monitoring-type-list.component.scss'],
  imports: [TableModule, ButtonModule, IconFieldModule, InputIcon, InputTextModule, ModalMonitoringTypeFormComponent, TextPipe]
})
export class MonitoringTypeListComponent implements OnInit {

  @ViewChild(ModalMonitoringTypeFormComponent) monitoringTypeForm!: ModalMonitoringTypeFormComponent;

  notificationService = inject(NotificationService);
  monitoringTypeService = inject(MonitoringTypeService);
  companyService = inject(CompanyService);

  monitoringTypes = signal<MonitoringType[]>([]);

  constructor() {
    // Escuchar cambios en la compañía seleccionada
    effect(() => {
      const company = this.companyService.selectedCompany();
      if (company) {
        this.fetchData();
      }
    });
  }

  ngOnInit() {
    // Solo cargar si ya hay una compañía seleccionada
    if (this.companyService.selectedCompany()) {
      this.fetchData();
    }
  }

  fetchData(){
    this.monitoringTypeService.getMonitoringTypes().then(types => {
      this.monitoringTypes.set(types);
    }).catch(error => {
      console.error('Error loading monitoring types:', error);
      this.notificationService.error('Error al cargar los tipos de monitoreo');
    });
  }

  openCreateModal() {
    this.monitoringTypeForm.showModal();
  }

  openEditModal(monitoringType: MonitoringType) {
    this.monitoringTypeForm.showModal(monitoringType);
  }

  onMonitoringTypeSaved() {
    this.fetchData();
  }
}
