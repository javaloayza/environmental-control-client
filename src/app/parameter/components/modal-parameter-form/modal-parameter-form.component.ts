import { Component, OnInit, Output, EventEmitter, Input, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { Parameter } from 'app/parameter/models';
import { ParameterService } from 'app/parameter/services';
import { RegulationService } from 'app/regulation/services';
import { Regulation } from 'app/regulation/models';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-parameter-form',
  templateUrl: './modal-parameter-form.component.html',
  styleUrls: ['./modal-parameter-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, SelectModule, TextPipe, ReactiveFormsModule]
})
export class ModalParameterFormComponent implements OnInit {
  @Input() selectedParameter: Parameter | null = null;
  @Input() defaultRegulationUid: string | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = signal(false);
  parameterForm!: FormGroup;
  loading = false;
  regulations = signal<Regulation[]>([]);

  private fb = inject(FormBuilder);
  private parameterService = inject(ParameterService);
  private regulationService = inject(RegulationService);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const hasCompany = this.companyService.selectedCompany();

      if (isVisible && hasCompany) {
        this.loadRegulations();
      }
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.parameterForm = this.fb.group({
      uidRegulation: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lmin: [null, [Validators.required]],
      lmax: [null, [Validators.required]],
      reference: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async loadRegulations() {
    try {
      const regulations = await this.regulationService.getRegulations();
      this.regulations.set(regulations);
    } catch (error) {
      console.error('Error loading regulations:', error);
      this.notificationService.error('No se pudieron cargar las regulaciones');
    }
  }

  showModal(parameter?: Parameter) {
    if (parameter) {
      this.mode = 'Update';
      this.selectedParameter = parameter;
      this.parameterForm.patchValue({
        uidRegulation: parameter.uidRegulation,
        name: parameter.name,
        lmin: parameter.lmin,
        lmax: parameter.lmax,
        reference: parameter.reference,
        description: parameter.description
      });
    } else {
      this.mode = 'Create';
      this.selectedParameter = null;
      this.parameterForm.reset();

      if (this.defaultRegulationUid) {
        this.parameterForm.patchValue({
          uidRegulation: this.defaultRegulationUid
        });
      }
    }
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
    this.parameterForm.reset();
    this.selectedParameter = null;
  }

  async saveParameter() {
    if (!this.parameterForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.parameterForm.value;

      if (this.mode === 'Create') {
        await this.parameterService.createParameter(formValue);
        this.notificationService.success(customTextUtil('parameter.created', 'Parametro Creado'));
      } else {
        const parameterData: Parameter = {
          ...formValue,
          uidParameter: this.selectedParameter?.uidParameter || '',
          uidCompany: this.selectedParameter?.uidCompany || ''
        };
        await this.parameterService.updateParameter(parameterData);
        this.notificationService.success(customTextUtil('parameter.updated', 'Parametro Actualizado'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
