import { Component, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { Regulation } from 'app/regulation/models/regulation';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ModalRegulationFormComponent } from "app/regulation/components";
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { RegulationService } from 'app/regulation/services';
import { CompanyService } from 'app/company/services/company.service';

@Component({
  selector: 'app-regulation-list',
  templateUrl: './regulation-list.component.html',
  styleUrls: ['./regulation-list.component.scss'],
  imports: [TableModule, ButtonModule, IconFieldModule, InputIcon, InputTextModule, ModalRegulationFormComponent, TextPipe]
})
export class RegulationListComponent implements OnInit {

  @ViewChild(ModalRegulationFormComponent) regulationForm!: ModalRegulationFormComponent;

  notificationService = inject(NotificationService);
  regulationService = inject(RegulationService);
  companyService = inject(CompanyService);

  regulations = signal<Regulation[]>([]);

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
    this.regulationService.getRegulations().then(regulations => {
      this.regulations.set(regulations);
    }).catch(error => {
      console.error('Error loading regulations:', error);
      this.notificationService.error('Error al cargar las regulaciones');
    });
  }

  openCreateModal() {
    this.regulationForm.showModal();
  }

  openEditModal(regulation: Regulation) {
    this.regulationForm.showModal(regulation);
  }

  onRegulationSaved() {
    this.fetchData();
  }
}
