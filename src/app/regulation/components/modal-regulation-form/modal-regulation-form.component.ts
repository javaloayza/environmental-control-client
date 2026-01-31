import { Component, OnInit, Output, EventEmitter, Input, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { Regulation } from 'app/regulation/models';
import { RegulationService } from 'app/regulation/services';
import { MonitoringTypeService } from 'app/monitoring-type/services';
import { MonitoringType } from 'app/monitoring-type/models';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-regulation-form',
  templateUrl: './modal-regulation-form.component.html',
  styleUrls: ['./modal-regulation-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, SelectModule, TextPipe, ReactiveFormsModule]
})
export class ModalRegulationFormComponent implements OnInit {
  @Input() selectedRegulation: Regulation | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = false;
  regulationForm!: FormGroup;
  loading = false;
  monitoringTypes = signal<MonitoringType[]>([]);

  private fb = inject(FormBuilder);
  private regulationService = inject(RegulationService);
  private monitoringTypeService = inject(MonitoringTypeService);
  private notificationService = inject(NotificationService);


  ngOnInit() {
    this.initializeForm();
    this.loadMonitoringTypes();
  }

  initializeForm() {
    this.regulationForm = this.fb.group({
      uidMonitoringType: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      autority: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async loadMonitoringTypes() {
    try {
      const types = await this.monitoringTypeService.getMonitoringTypes();
      this.monitoringTypes.set(types);
    } catch (error) {
      console.error('Error loading monitoring types:', error);
    }
  }

  showModal(regulation?: Regulation) {
    if (regulation) {
      this.mode = 'Update';
      this.selectedRegulation = regulation;
      this.regulationForm.patchValue(regulation);
    } else {
      this.mode = 'Create';
      this.selectedRegulation = null;
      this.regulationForm.reset();
    }
    this.visible = true;
  }

  hideModal() {
    this.visible = false;
    this.regulationForm.reset();
    this.selectedRegulation = null;
  }

  async saveRegulation() {
    if (!this.regulationForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.regulationForm.value;

      if (this.mode === 'Create') {
        await this.regulationService.createRegulation(formValue);
        this.notificationService.success(customTextUtil('regulation.created', 'Regulación Creada'));
      } else {
        const regulationData: Regulation = {
          ...formValue,
          idRegulation: this.selectedRegulation?.idRegulation || 0,
          uidRegulation: this.selectedRegulation?.uidRegulation || '',
          uidCompany: this.selectedRegulation?.uidCompany || ''
        };
        await this.regulationService.updateRegulation(regulationData);
        this.notificationService.success(customTextUtil('regulation.updated', 'Regulación Actualizada'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
