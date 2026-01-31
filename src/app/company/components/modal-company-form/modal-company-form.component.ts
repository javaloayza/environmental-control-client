import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextPipe } from '@shared/pipes';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { Company } from 'app/company/models';
import { CompanyService } from 'app/company/services';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-modal-company-form',
  templateUrl: './modal-company-form.component.html',
  styleUrls: ['./modal-company-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule, TextPipe, ReactiveFormsModule]
})
export class ModalCompanyFormComponent implements OnInit {
  @Input() selectedCompany: Company | null = null;
  @Output() saved = new EventEmitter<void>();

  mode: 'Create' | 'Update' = 'Create';
  visible = false;
  companyForm!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private notificationService = inject(NotificationService);


  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.minLength(5)]],
      idCountry: [0, [Validators.required, Validators.min(1)]],
      idState: [0, [Validators.required, Validators.min(1)]],
    });
  }

  showModal(company?: Company) {
    if (company) {
      this.mode = 'Update';
      this.selectedCompany = company;
      this.companyForm.patchValue(company);
    } else {
      this.mode = 'Create';
      this.selectedCompany = null;
      this.companyForm.reset();
    }
    this.visible = true;
  }

  hideModal() {
    this.visible = false;
    this.companyForm.reset();
    this.selectedCompany = null;
  }

  async saveCompany() {
    if (!this.companyForm.valid) {
      this.notificationService.warn('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      const formValue = this.companyForm.value;

      if (this.mode === 'Create') {
        await this.companyService.createCompany(formValue);
        this.notificationService.success(customTextUtil('company.created', 'Company Created'));
      } else {
        const companyData: Company = {
          ...formValue,
          idCompany: this.selectedCompany?.idCompany || 0,
          uidCompany: this.selectedCompany?.uidCompany || '',
        };
        await this.companyService.updateCompany(companyData);
        this.notificationService.success(customTextUtil('company.updated', 'Company Updated'));
      }

      this.saved.emit();
      this.hideModal();
    } finally {
      this.loading = false;
    }
  }
}
