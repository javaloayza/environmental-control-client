import { Component, OnInit, Output, EventEmitter, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { Location } from 'app/location/models';
import { LocationService } from 'app/location/services';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-location-form',
  templateUrl: './modal-location-form.component.html',
  styleUrls: ['./modal-location-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, TextPipe, ReactiveFormsModule]
})
export class ModalLocationFormComponent implements OnInit {
  @Input() selectedLocation: Location | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = signal(false);
  locationForm!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private locationService = inject(LocationService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  showModal(location?: Location) {
    if (location) {
      this.mode = 'Update';
      this.selectedLocation = location;
      this.locationForm.patchValue(location);
    } else {
      this.mode = 'Create';
      this.selectedLocation = null;
      this.locationForm.reset();
    }
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
    this.locationForm.reset();
    this.selectedLocation = null;
  }

  async saveLocation() {
    if (!this.locationForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.locationForm.value;

      if (this.mode === 'Create') {
        await this.locationService.createLocation(formValue);
        this.notificationService.success(customTextUtil('location.created', 'Ubicación Creada'));
      } else {
        const locationData: Location = {
          ...formValue,
          idLocation: this.selectedLocation?.idLocation || 0,
          uidLocation: this.selectedLocation?.uidLocation || '',
          uidCompany: this.selectedLocation?.uidCompany || ''
        };
        await this.locationService.updateLocation(locationData);
        this.notificationService.success(customTextUtil('location.updated', 'Ubicación Actualizada'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
