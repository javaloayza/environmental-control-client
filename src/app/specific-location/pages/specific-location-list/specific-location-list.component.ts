import { Component, inject, OnInit, signal, ViewChild, effect, computed } from '@angular/core';
import { SpecificLocation } from 'app/specific-location/models/specific-location';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ModalSpecificLocationFormComponent } from 'app/specific-location/components';
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { SpecificLocationService } from 'app/specific-location/services';
import { CompanyService } from 'app/company/services/company.service';
import { LocationService } from 'app/location/services';
import { Location } from 'app/location/models';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-specific-location-list',
  templateUrl: './specific-location-list.component.html',
  styleUrls: ['./specific-location-list.component.scss'],
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIcon,
    InputTextModule,
    SelectModule,
    FormsModule,
    ModalSpecificLocationFormComponent,
    TextPipe
  ]
})
export class SpecificLocationListComponent implements OnInit {

  @ViewChild(ModalSpecificLocationFormComponent) specificLocationForm!: ModalSpecificLocationFormComponent;

  notificationService = inject(NotificationService);
  specificLocationService = inject(SpecificLocationService);
  locationService = inject(LocationService);
  companyService = inject(CompanyService);

  specificLocations = signal<SpecificLocation[]>([]);
  locations = signal<Location[]>([]);
  searchTerm = signal('');
  selectedLocationUid = signal<string | null>(null);

  filteredSpecificLocations = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const locationUid = this.selectedLocationUid();

    return this.specificLocations().filter((item) => {
      const matchesName = !term || item.name?.toLowerCase().includes(term);
      const matchesLocation = !locationUid || item.uidLocation === locationUid;
      return matchesName && matchesLocation;
    });
  });

  constructor() {
    effect(() => {
      const company = this.companyService.selectedCompany();
      if (company) {
        this.fetchData();
        this.loadLocations();
      }
    });
  }

  ngOnInit() {
    if (this.companyService.selectedCompany()) {
      this.fetchData();
      this.loadLocations();
    }
  }

  fetchData() {
    this.specificLocationService.getSpecificLocations().then(specificLocations => {
      this.specificLocations.set(specificLocations);
    }).catch(error => {
      console.error('Error loading specific locations:', error);
      this.notificationService.error('Error al cargar las ubicaciones especificas');
    });
  }

  loadLocations() {
    this.locationService.getLocations().then(locations => {
      this.locations.set(locations);
    }).catch(error => {
      console.error('Error loading locations:', error);
      this.notificationService.error('Error al cargar las ubicaciones');
    });
  }

  onSearchChange(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onLocationChange(value: string | null) {
    this.selectedLocationUid.set(value || null);
  }

  openCreateModal() {
    this.specificLocationForm.showModal();
  }

  openEditModal(specificLocation: SpecificLocation) {
    this.specificLocationForm.showModal(specificLocation);
  }

  async deleteSpecificLocation(specificLocation: SpecificLocation) {
    if (!specificLocation?.uidSpecificLocation) {
      return;
    }

    try {
      await this.specificLocationService.deleteSpecificLocation(specificLocation.uidSpecificLocation);
      this.notificationService.success(customTextUtil('specific-location.deleted', 'Ubicacion Especifica Eliminada'));
      this.fetchData();
    } catch (error) {
      console.error('Error deleting specific location:', error);
      this.notificationService.error('Error al eliminar la ubicacion especifica');
    }
  }

  onSpecificLocationSaved() {
    this.fetchData();
  }
}
