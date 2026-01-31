import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Company } from 'app/company/models/company';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ModalCompanyFormComponent } from "app/company/components";
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { CompanyService } from 'app/company/services';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  imports: [TableModule, ButtonModule, IconFieldModule, InputIcon, InputTextModule, ModalCompanyFormComponent, TextPipe]
})
export class CompanyListComponent implements OnInit {

  @ViewChild(ModalCompanyFormComponent) companyForm!: ModalCompanyFormComponent;

  notificationService = inject(NotificationService);
  companyService = inject(CompanyService);

  companies = signal<Company[]>([]);

  constructor() { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData(){
    this.companyService.getCompanies().then(companies => {
      this.companies.set(companies);
    });
  }

  openCreateModal() {
    this.companyForm.showModal();
  }

  openEditModal(company: Company) {
    this.companyForm.showModal(company);
  }

  onCompanySaved() {
    this.fetchData();
  }
}
