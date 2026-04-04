import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services';
import { Parameter } from '../models';
import { PARAMETER_ENDPOINTS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private api = inject(ApiService);

  getParameters(): Promise<Parameter[]> {
    const apiUrl = PARAMETER_ENDPOINTS.GET_LIST;
    // El catálogo es global, no requiere uidCompany según el API
    const body = {};
    return firstValueFrom(this.api.getData<Parameter[]>(apiUrl, body));
  }

  createParameter(parameter: Partial<Parameter>): Promise<void> {
    const apiUrl = PARAMETER_ENDPOINTS.INSERT;
    const body = {
      name: parameter.name,
      description: parameter.description,
      default_unit: parameter.defaultUnit,
      status: parameter.status
    };
    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }

  updateParameter(parameter: Parameter): Promise<void> {
    const apiUrl = PARAMETER_ENDPOINTS.UPDATE;
    const body = {
      uidParameter: parameter.uidParameter,
      name: parameter.name,
      description: parameter.description,
      default_unit: parameter.defaultUnit,
      status: parameter.status
    };
    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }

  deleteParameter(uidParameter: string): Promise<void> {
    const apiUrl = PARAMETER_ENDPOINTS.DELETE;
    const body = {
      uidParameter: uidParameter
    };
    return firstValueFrom(this.api.postData<void>(apiUrl, body));
  }
}
