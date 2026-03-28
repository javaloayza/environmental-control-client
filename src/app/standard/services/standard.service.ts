/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Standard } from '../models';
import { STANDARD_ENDPOINTS } from '../constants';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class StandardService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);

  getStandards(uidRegulation: string, uidCompany?: string): Promise<Standard[]> {
    const apiUrl = STANDARD_ENDPOINTS.GET_LIST;
    const company = uidCompany || this.companyService.selectedCompany()?.uidCompany;

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      "uidCompany": company,
      "uidRegulation": uidRegulation
    };

    return firstValueFrom(this.api.getData<Standard[]>(apiUrl, body));
  }

  createStandard(parameter: Partial<Standard>): Promise<Standard> {
    const apiUrl = STANDARD_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidRegulation: parameter.uidRegulation,
      name: parameter.name,
      lmin: parameter.lmin,
      lmax: parameter.lmax,
      reference: parameter.reference,
      description: parameter.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<Standard>(apiUrl, body));
  }

  updateStandard(parameter: Standard): Promise<Standard> {
    const apiUrl = STANDARD_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidParameter: parameter.uidParameter,
      uidRegulation: parameter.uidRegulation,
      name: parameter.name,
      lmin: parameter.lmin,
      lmax: parameter.lmax,
      reference: parameter.reference,
      description: parameter.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<Standard>(apiUrl, body));
  }

  deleteStandard(uidParameter: string): Promise<void> {
    const apiUrl = STANDARD_ENDPOINTS.DELETE;

    const body = {
      uidParameter: uidParameter
    };

    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}
