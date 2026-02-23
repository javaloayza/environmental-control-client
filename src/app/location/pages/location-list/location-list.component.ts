import { Component, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { Location } from 'app/location/models/location';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ModalLocationFormComponent } from "app/location/components";
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { LocationService } from 'app/location/services';
import { CompanyService } from 'app/company/services/company.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  imports: [TableModule, ButtonModule, IconFieldModule, InputIcon, InputTextModule, ModalLocationFormComponent, TextPipe]
})
export class LocationListComponent implements OnInit {

  @ViewChild(ModalLocationFormComponent) locationForm!: ModalLocationFormComponent;

  notificationService = inject(NotificationService);
  locationService = inject(LocationService);
  companyService = inject(CompanyService);
  confirmationService = inject(ConfirmationService);
  locations = signal<Location[]>([]);

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
    this.locationService.getLocations().then(locations => {
      this.locations.set(locations);
    }).catch(error => {
      this.notificationService.error('Error al cargar las ubicaciones');
    });
  }

  openCreateModal() {
    this.locationForm.showModal();
  }

  openEditModal(location: Location) {
    this.locationForm.showModal(location);
  }

  onLocationSaved() {
    this.fetchData();
  }
}
