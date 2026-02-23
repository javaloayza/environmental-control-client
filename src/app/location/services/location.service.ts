/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Location } from '../models';
import { LOCATION_ENDPOINTS } from '../constants/location-endpoints';
import { CompanyService } from '../../company/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private api = inject(ApiService);
  private companyService = inject(CompanyService);

  getLocations(uidCompany?: string): Promise<Location[]> {
    const apiUrl = LOCATION_ENDPOINTS.GET_LIST;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      idCompany: company.idCompany
    };
    return firstValueFrom(this.api.getData<Location[]>(apiUrl, body));
  }

  createLocation(location: Partial<Location>): Promise<Location> {
    const apiUrl = LOCATION_ENDPOINTS.INSERT;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    if (company.idCompany === 0 || company.idCompany === null || company.idCompany === undefined) {
      throw new Error('Invalid company idCompany');
    }

    const body = {
      idCompany: company.idCompany,
      codeLocation: location.codeLocation,
      description: location.description,
      longitude: location.longitude,
      latitude: location.latitude
    };

    return firstValueFrom(this.api.postData<Location>(apiUrl, body));
  }

  updateLocation(location: Location): Promise<Location> {
    const apiUrl = LOCATION_ENDPOINTS.UPDATE;
    const company = this.companyService.selectedCompany();

    if (!company) {
      throw new Error('No company selected');
    }

    const body = {
      uidLocation: location.uidLocation,
      idCompany: company.idCompany,
      codeLocation: location.codeLocation,
      description: location.description,
      longitude: location.longitude,
      latitude: location.latitude
    };

    return firstValueFrom(this.api.postData<Location>(apiUrl, body));
  }

  deleteLocation(uidLocation: string): Promise<void> {
    const apiUrl = LOCATION_ENDPOINTS.DELETE;

    const body = {
      uidLocation: uidLocation
    };

    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}
