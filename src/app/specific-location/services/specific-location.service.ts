/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { SpecificLocation } from '../models';
import { SPECIFIC_LOCATION_ENDPOINTS } from '../constants';
import { CompanyService } from '../../company/services/company.service';
import { LocationService } from '../../location/services/location.service';

@Injectable({
  providedIn: 'root',
})
export class SpecificLocationService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);
  private locationService = inject(LocationService);

  getSpecificLocations(): Promise<SpecificLocation[]> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.GET_LIST;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      idCompany: company.idCompany
    };

    return firstValueFrom(this.api.getData<SpecificLocation[]>(apiUrl, body));
  }

  async createSpecificLocation(specificLocation: Partial<SpecificLocation>): Promise<SpecificLocation> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    // Resolve idLocation from uidLocation
    let idLocation: number | null = null;
    if (specificLocation.uidLocation) {
      const locations = await this.locationService.getLocations();
      const found = locations.find(l => l.uidLocation === specificLocation.uidLocation);
      idLocation = found ? found.idLocation : null;
    }

    const body = {
      idCompany: company.idCompany,
      description: specificLocation.description ?? '',
      codeSpecificLocation: specificLocation.name ?? '',
      longitude: (specificLocation as any).longitude ?? '',
      latitude: (specificLocation as any).latitude ?? '',
      idLocation: idLocation
    };

    return firstValueFrom(this.api.postData<SpecificLocation>(apiUrl, body));
  }

  async updateSpecificLocation(specificLocation: SpecificLocation): Promise<SpecificLocation> {
    const apiUrl = SPECIFIC_LOCATION_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    // Resolve idLocation from uidLocation
    let idLocation: number | null = null;
    if (specificLocation.uidLocation) {
      const locations = await this.locationService.getLocations();
      const found = locations.find(l => l.uidLocation === specificLocation.uidLocation);
      idLocation = found ? found.idLocation : null;
    }

    const body = {
      uidSpecificLocation: specificLocation.uidSpecificLocation,
      idCompany: company.idCompany,
      description: specificLocation.description ?? '',
      codeSpecificLocation: specificLocation.name ?? '',
      longitude: (specificLocation as any).longitude ?? '',
      latitude: (specificLocation as any).latitude ?? '',
      idLocation: idLocation
    };

    return firstValueFrom(this.api.postData<SpecificLocation>(apiUrl, body));
  }

  // Delete endpoint is not implemented in backend (soft delete not exposed).
  // Expose a stub that throws to avoid calling a non-existent API route.
  deleteSpecificLocation(_: string): Promise<void> {
    return Promise.reject(new Error('Delete operation not supported by API'));
  }
}
