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

  createMonitoringType(monitoringType: Partial<MonitoringType>): Promise<MonitoringType> {
    const apiUrl = MONITORING_TYPE_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      nameMonitoring: monitoringType.nameMonitoring,
      description: monitoringType.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<MonitoringType>(apiUrl, body));
  }

  updateMonitoringType(monitoringType: MonitoringType): Promise<MonitoringType> {
    const apiUrl = MONITORING_TYPE_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidMonitoringType: monitoringType.uidMonitoringType,
      nameMonitoring: monitoringType.nameMonitoring,
      description: monitoringType.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<MonitoringType>(apiUrl, body));
  }

  deleteMonitoringType(uidMonitoringType: string): Promise<void> {
    const apiUrl = MONITORING_TYPE_ENDPOINTS.DELETE;

    const body = {
      uidMonitoringType: uidMonitoringType
    };

    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}

