import { Component, OnInit, Output, EventEmitter, Input, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { SpecificLocation } from 'app/specific-location/models';
import { SpecificLocationService } from 'app/specific-location/services';
import { LocationService } from 'app/location/services';
import { Location } from 'app/location/models';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-specific-location-form',
  templateUrl: './modal-specific-location-form.component.html',
  styleUrls: ['./modal-specific-location-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, SelectModule, TextPipe, ReactiveFormsModule]
})
export class ModalSpecificLocationFormComponent implements OnInit {
  @Input() selectedSpecificLocation: SpecificLocation | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = signal(false);
  specificLocationForm!: FormGroup;
  loading = false;
  locations = signal<Location[]>([]);

  private fb = inject(FormBuilder);
  private specificLocationService = inject(SpecificLocationService);
  private locationService = inject(LocationService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const hasCompany = this.companyService.selectedCompany();

      if (isVisible && hasCompany) {
        this.loadLocations();
      }
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.specificLocationForm = this.fb.group({
      uidLocation: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async loadLocations() {
    try {
      const locations = await this.locationService.getLocations();
      this.locations.set(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
      this.notificationService.error('No se pudieron cargar las ubicaciones');
    }
  }

  showModal(specificLocation?: SpecificLocation) {
    if (specificLocation) {
      this.mode = 'Update';
      this.selectedSpecificLocation = specificLocation;
      this.specificLocationForm.patchValue({
        uidLocation: specificLocation.uidLocation,
        name: specificLocation.name,
        description: specificLocation.description
      });
    } else {
      this.mode = 'Create';
      this.selectedSpecificLocation = null;
      this.specificLocationForm.reset();
    }
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
    this.specificLocationForm.reset();
    this.selectedSpecificLocation = null;
  }

  async saveSpecificLocation() {
    if (!this.specificLocationForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.specificLocationForm.value;

      if (this.mode === 'Create') {
        await this.specificLocationService.createSpecificLocation(formValue);
        this.notificationService.success(customTextUtil('specific-location.created', 'Ubicacion Especifica Creada'));
      } else {
        const specificLocationData: SpecificLocation = {
          ...formValue,
          uidSpecificLocation: this.selectedSpecificLocation?.uidSpecificLocation || '',
          uidCompany: this.selectedSpecificLocation?.uidCompany || ''
        };
        await this.specificLocationService.updateSpecificLocation(specificLocationData);
        this.notificationService.success(customTextUtil('specific-location.updated', 'Ubicacion Especifica Actualizada'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
