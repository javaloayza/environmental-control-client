/* eslint-disable quotes */
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Company } from '../models';
import { COMPANY_ENDPOINTS } from '../constants/company-endpoints';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private api = inject(ApiService);
  selectedCompany = signal<Company | null>(null);


  getCompanies(): Promise<Company[]> {
    const apiUrl = COMPANY_ENDPOINTS.GET_LIST;
    return firstValueFrom(this.api.getData<Company[]>(apiUrl));
  }

  createCompany(company: Partial<Company>): Promise<Company> {
    const apiUrl = COMPANY_ENDPOINTS.INSERT;
    return firstValueFrom(this.api.postData<Company>(apiUrl, company));
  }

  updateCompany(company: Company): Promise<Company> {
    const apiUrl = COMPANY_ENDPOINTS.UPDATE;
    return firstValueFrom(this.api.postData<Company>(apiUrl, company));
  }

  setSelectedCompany(company: Company): void {
    this.selectedCompany.set(company);
  }

  getSelectedCompany(): Company | null {
    return this.selectedCompany();
  }
}
