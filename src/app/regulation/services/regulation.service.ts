import { Injectable } from '@angular/core';
import { Regulation, MonitoringType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RegulationService {
  private regulations: Regulation[] = [
    {
      id: '1',
      uid_regulation: 'REG-001',
      tipoMonitoreoId: '1',
      code: 'NOR-001',
      title: 'Monitoreo de Agua',
      description: 'Regulación para monitoreo de calidad de agua',
      companyId: '1',
      authority: 'MINAM',
      status: 'active'
    },
    {
      id: '2',
      uid_regulation: 'REG-002',
      tipoMonitoreoId: '2',
      code: 'NOR-002',
      title: 'Monitoreo de Aire',
      description: 'Regulación para monitoreo de calidad del aire',
      companyId: '1',
      authority: 'OEFA',
      status: 'active'
    },
    {
      id: '3',
      uid_regulation: 'REG-003',
      tipoMonitoreoId: '3',
      code: 'NOR-003',
      title: 'Monitoreo de Suelo',
      description: 'Regulación para monitoreo de contaminación del suelo',
      companyId: '2',
      authority: 'MINAM',
      status: 'active'
    }
  ];

  private monitoringTypes: MonitoringType[] = [
    {
      id: '1',
      uid_monitoring_type: 'MT-001',
      name_monitoring: 'Agua',
      description: 'Monitoreo de agua',
      status: 'active',
      uid_company: '1'
    },
    {
      id: '2',
      uid_monitoring_type: 'MT-002',
      name_monitoring: 'Aire',
      description: 'Monitoreo de aire',
      status: 'active',
      uid_company: '1'
    },
    {
      id: '3',
      uid_monitoring_type: 'MT-003',
      name_monitoring: 'Suelo',
      description: 'Monitoreo de suelo',
      status: 'active',
      uid_company: '2'
    }
  ];

  getRegulations(): Regulation[] {
    return [...this.regulations];
  }

  getMonitoringTypes(): MonitoringType[] {
    return [...this.monitoringTypes];
  }

  updateRegulation(regulation: Regulation): Promise<Regulation> {
    const index = this.regulations.findIndex(r => r.id === regulation.id);
    if (index > -1) {
      this.regulations[index] = { ...regulation };
      return Promise.resolve(this.regulations[index]);
    }
    return Promise.reject(new Error('Regulation not found'));
  }

  getRegulationById(id: string): Regulation | undefined {
    return this.regulations.find(r => r.id === id);
  }
}
