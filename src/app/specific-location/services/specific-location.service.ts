/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { SpecificLocation } from '../models';
import { SPECIFIC_LOCATION_ENDPOINTS } from '../constants';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class SpecificLocationService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);

  getSpecificLocations(uidCompany?: string): Promise<SpecificLocation[]> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.GET_LIST;
    const company = uidCompany || this.companyService.selectedCompany()?.uidCompany;

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      "uidCompany": company
    };

    return firstValueFrom(this.api.getData<SpecificLocation[]>(apiUrl, body));
  }

  createSpecificLocation(specificLocation: Partial<SpecificLocation>): Promise<SpecificLocation> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidLocation: specificLocation.uidLocation,
      name: specificLocation.name,
      description: specificLocation.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<SpecificLocation>(apiUrl, body));
  }

  updateSpecificLocation(specificLocation: SpecificLocation): Promise<SpecificLocation> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidSpecificLocation: specificLocation.uidSpecificLocation,
      uidLocation: specificLocation.uidLocation,
      name: specificLocation.name,
      description: specificLocation.description,
      uidCompany: company.uidCompany
    };

    return firstValueFrom(this.api.postData<SpecificLocation>(apiUrl, body));
  }

  deleteSpecificLocation(uidSpecificLocation: string): Promise<void> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.DELETE;

    const body = {
      uidSpecificLocation: uidSpecificLocation
    };

    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}
