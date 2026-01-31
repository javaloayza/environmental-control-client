/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { MonitoringType } from '../models';
import { MONITORING_TYPE_ENDPOINTS } from '../constants';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class MonitoringTypeService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);

  getMonitoringTypes(uidCompany?: string): Promise<MonitoringType[]> {
    const apiUrl = MONITORING_TYPE_ENDPOINTS.GET_LIST;
    const company = uidCompany || this.companyService.selectedCompany()?.uidCompany;

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      "uidCompany": company
    };
    return firstValueFrom(this.api.getData<MonitoringType[]>(apiUrl, body));
  }
}
