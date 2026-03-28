import { Component, OnInit, Output, EventEmitter, Input, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { Standard } from 'app/standard/models';
import { StandardService } from 'app/standard/services';
import { RegulationService } from 'app/regulation/services';
import { Regulation } from 'app/regulation/models';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-standard-form',
  templateUrl: './modal-standard-form.component.html',
  styleUrls: ['./modal-standard-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, SelectModule, TextPipe, ReactiveFormsModule]
})
export class ModalStandardFormComponent implements OnInit {
  @Input() selectedStandard: Standard | null = null;
  @Input() defaultRegulationUid: string | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = signal(false);
  standardForm!: FormGroup;
  loading = false;
  regulations = signal<Regulation[]>([]);

  private fb = inject(FormBuilder);
  private standardService = inject(StandardService);
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
    this.standardForm = this.fb.group({
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

  showModal(parameter?: Standard) {
    if (parameter) {
      this.mode = 'Update';
      this.selectedStandard = parameter;
      this.standardForm.patchValue({
        uidRegulation: parameter.uidRegulation,
        name: parameter.name,
        lmin: parameter.lmin,
        lmax: parameter.lmax,
        reference: parameter.reference,
        description: parameter.description
      });
    } else {
      this.mode = 'Create';
      this.selectedStandard = null;
      this.standardForm.reset();

      if (this.defaultRegulationUid) {
        this.standardForm.patchValue({
          uidRegulation: this.defaultRegulationUid
        });
      }
    }
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
    this.standardForm.reset();
    this.selectedStandard = null;
  }

  async saveStandard() {
    if (!this.standardForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.standardForm.value;

      if (this.mode === 'Create') {
        await this.standardService.createStandard(formValue);
        this.notificationService.success(customTextUtil('standard.created', 'Parametro Creado'));
      } else {
        const parameterData: Standard = {
          ...formValue,
          uidParameter: this.selectedStandard?.uidParameter || '',
          uidCompany: this.selectedStandard?.uidCompany || ''
        };
        await this.standardService.updateStandard(parameterData);
        this.notificationService.success(customTextUtil('standard.updated', 'Parametro Actualizado'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
