import { Component, OnInit, Output, EventEmitter, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { MonitoringType } from 'app/monitoring-type/models';
import { MonitoringTypeService } from 'app/monitoring-type/services';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-monitoring-type-form',
  templateUrl: './modal-monitoring-type-form.component.html',
  styleUrls: ['./modal-monitoring-type-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, TextPipe, ReactiveFormsModule]
})
export class ModalMonitoringTypeFormComponent implements OnInit {
  @Input() selectedMonitoringType: MonitoringType | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = signal(false);
  monitoringTypeForm!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private monitoringTypeService = inject(MonitoringTypeService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.monitoringTypeForm = this.fb.group({
      nameMonitoring: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  showModal(monitoringType?: MonitoringType) {
    if (monitoringType) {
      this.mode = 'Update';
      this.selectedMonitoringType = monitoringType;
      this.monitoringTypeForm.patchValue(monitoringType);
    } else {
      this.mode = 'Create';
      this.selectedMonitoringType = null;
      this.monitoringTypeForm.reset();
    }
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
    this.monitoringTypeForm.reset();
    this.selectedMonitoringType = null;
  }

  async saveMonitoringType() {
    if (!this.monitoringTypeForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.monitoringTypeForm.value;

      if (this.mode === 'Create') {
        await this.monitoringTypeService.createMonitoringType(formValue);
        this.notificationService.success(customTextUtil('monitoring-type.created', 'Tipo de Monitoreo Creado'));
      } else {
        const monitoringTypeData: MonitoringType = {
          ...formValue,
          uidMonitoringType: this.selectedMonitoringType?.uidMonitoringType || '',
          uidCompany: this.selectedMonitoringType?.uidCompany || ''
        };
        await this.monitoringTypeService.updateMonitoringType(monitoringTypeData);
        this.notificationService.success(customTextUtil('monitoring-type.updated', 'Tipo de Monitoreo Actualizado'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
