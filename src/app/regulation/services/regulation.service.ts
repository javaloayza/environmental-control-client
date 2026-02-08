/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Regulation } from '../models';
import { REGULATION_ENDPOINTS } from '../constants/regulation-endpoints';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class RegulationService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);


  getRegulations(uidCompany?: string): Promise<Regulation[]> {
    const apiUrl = REGULATION_ENDPOINTS.GET_LIST;
    const company = uidCompany || this.companyService.selectedCompany()?.uidCompany;

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      "uidCompany": company
    };
    return firstValueFrom(this.api.getData<Regulation[]>(apiUrl, body));
  }

  createRegulation(regulation: Partial<Regulation>): Promise<Regulation> {
    const apiUrl = REGULATION_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidMonitoringType: regulation.uidMonitoringType,
      code: regulation.code,
      title: regulation.title,
      description: regulation.description,
      autority: regulation.autority,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<Regulation>(apiUrl, body));
  }

  updateRegulation(regulation: Regulation): Promise<Regulation> {
    const apiUrl = REGULATION_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidRegulation: regulation.uidRegulation,
      uidMonitoringType: regulation.uidMonitoringType,
      code: regulation.code,
      title: regulation.title,
      description: regulation.description,
      autority: regulation.autority,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<Regulation>(apiUrl, body));
  }
}
