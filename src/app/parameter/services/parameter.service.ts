/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Parameter } from '../models';
import { PARAMETER_ENDPOINTS } from '../constants';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);

  getParameters(uidRegulation: string, uidCompany?: string): Promise<Parameter[]> {
    const apiUrl = PARAMETER_ENDPOINTS.GET_LIST;
    const company = uidCompany || this.companyService.selectedCompany()?.uidCompany;

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      "uidCompany": company,
      "uidRegulation": uidRegulation
    };

    return firstValueFrom(this.api.getData<Parameter[]>(apiUrl, body));
  }

  createParameter(parameter: Partial<Parameter>): Promise<Parameter> {
    const apiUrl = PARAMETER_ENDPOINTS.INSERT;
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

    return firstValueFrom(this.api.postData<Parameter>(apiUrl, body));
  }

  updateParameter(parameter: Parameter): Promise<Parameter> {
    const apiUrl = PARAMETER_ENDPOINTS.UPDATE;
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

    return firstValueFrom(this.api.postData<Parameter>(apiUrl, body));
  }

  deleteParameter(uidParameter: string): Promise<void> {
    const apiUrl = PARAMETER_ENDPOINTS.DELETE;

    const body = {
      uidParameter: uidParameter
    };

    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}
