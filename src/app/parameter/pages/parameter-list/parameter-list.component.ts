import { Component, inject, OnInit, signal, ViewChild, effect, computed } from '@angular/core';
import { Parameter } from 'app/parameter/models/parameter';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ModalParameterFormComponent } from 'app/parameter/components';
import { NotificationService, SecureStorageService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { ParameterService } from 'app/parameter/services';
import { CompanyService } from 'app/company/services/company.service';
import { MonitoringTypeService } from 'app/monitoring-type/services';
import { MonitoringType } from 'app/monitoring-type/models';
import { RegulationService } from 'app/regulation/services';
import { Regulation } from 'app/regulation/models';
import { customTextUtil } from '@shared/utils';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss'],
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIcon,
    InputTextModule,
    SelectModule,
    FormsModule,
    TooltipModule,
    ModalParameterFormComponent,
    TextPipe
  ]
})
export class ParameterListComponent implements OnInit {

  @ViewChild(ModalParameterFormComponent) parameterForm!: ModalParameterFormComponent;

  notificationService = inject(NotificationService);
  parameterService = inject(ParameterService);
  monitoringTypeService = inject(MonitoringTypeService);
  regulationService = inject(RegulationService);
  companyService = inject(CompanyService);
  storageService = inject(SecureStorageService);

  parameters = signal<Parameter[]>([]);
  monitoringTypes = signal<MonitoringType[]>([]);
  regulations = signal<Regulation[]>([]);

  searchTerm = signal('');
  selectedMonitoringTypeUid = signal<string | null>(null);
  selectedRegulationUid = signal<string | null>(null);

  filteredRegulations = computed(() => {
    const typeUid = this.selectedMonitoringTypeUid();
    if (!typeUid) {
      return [];
    }

    return this.regulations().filter((regulation) => regulation.uidMonitoringType === typeUid);
  });

  filteredParameters = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const regulationUid = this.selectedRegulationUid();

    if (!regulationUid) {
      return [];
    }

    return this.parameters().filter((item) => {
      const matchesName = !term || item.name?.toLowerCase().includes(term);
      return matchesName && item.uidRegulation === regulationUid;
    });
  });

  constructor() {
    effect(() => {
      const company = this.companyService.selectedCompany();
      if (company) {
        void this.initializeModule();
      }
    });
  }

  ngOnInit() {
    if (this.companyService.selectedCompany()) {
      void this.initializeModule();
    }
  }

  private getStorageKey(key: 'monitoringType' | 'regulation'): string {
    const companyUid = this.companyService.selectedCompany()?.uidCompany || 'default';
    return `parameter.${companyUid}.${key}`;
  }

  private async initializeModule(): Promise<void> {
    await Promise.all([this.loadMonitoringTypes(), this.loadRegulations()]);
    await this.initializeSelections();
  }

  private async loadMonitoringTypes(): Promise<void> {
    try {
      const types = await this.monitoringTypeService.getMonitoringTypes();
      this.monitoringTypes.set(types);
    } catch (error) {
      console.error('Error loading monitoring types:', error);
      this.notificationService.error('Error al cargar los tipos de monitoreo');
    }
  }

  private async loadRegulations(): Promise<void> {
    try {
      const regs = await this.regulationService.getRegulations();
      this.regulations.set(regs);
    } catch (error) {
      console.error('Error loading regulations:', error);
      this.notificationService.error('Error al cargar las regulaciones');
    }
  }

  private async initializeSelections(): Promise<void> {
    const storedMonitoringType = await this.storageService.getItem<string>(this.getStorageKey('monitoringType'));
    const storedRegulation = await this.storageService.getItem<string>(this.getStorageKey('regulation'));

    const monitoringTypes = this.monitoringTypes();
    const defaultMonitoringType = monitoringTypes.find(type => type.uidMonitoringType === storedMonitoringType) || monitoringTypes[0];

    if (defaultMonitoringType) {
      this.selectedMonitoringTypeUid.set(defaultMonitoringType.uidMonitoringType);
      await this.storageService.setItem(this.getStorageKey('monitoringType'), defaultMonitoringType.uidMonitoringType);
    } else {
      this.selectedMonitoringTypeUid.set(null);
    }

    const filteredRegs = this.filteredRegulations();
    const defaultRegulation = filteredRegs.find(reg => reg.uidRegulation === storedRegulation) || filteredRegs[0];

    if (defaultRegulation) {
      this.selectedRegulationUid.set(defaultRegulation.uidRegulation);
      await this.storageService.setItem(this.getStorageKey('regulation'), defaultRegulation.uidRegulation);
      await this.fetchParameters();
    } else {
      this.selectedRegulationUid.set(null);
      this.parameters.set([]);
    }
  }

  async onMonitoringTypeChange(value: string | null) {
    this.selectedMonitoringTypeUid.set(value);

    if (value) {
      await this.storageService.setItem(this.getStorageKey('monitoringType'), value);
    }

    await this.syncRegulationSelection();
  }

  async onRegulationChange(value: string | null) {
    this.selectedRegulationUid.set(value || null);

    if (value) {
      await this.storageService.setItem(this.getStorageKey('regulation'), value);
    }

    await this.fetchParameters();
  }

  private async syncRegulationSelection(): Promise<void> {
    const filteredRegs = this.filteredRegulations();
    const nextRegulation = filteredRegs[0];

    if (nextRegulation) {
      this.selectedRegulationUid.set(nextRegulation.uidRegulation);
      await this.storageService.setItem(this.getStorageKey('regulation'), nextRegulation.uidRegulation);
      await this.fetchParameters();
    } else {
      this.selectedRegulationUid.set(null);
      this.parameters.set([]);
    }
  }

  async fetchParameters() {
    const regulationUid = this.selectedRegulationUid();

    if (!regulationUid) {
      this.parameters.set([]);
      return;
    }

    this.parameterService.getParameters(regulationUid).then(parameters => {
      this.parameters.set(parameters);
    }).catch(error => {
      console.error('Error loading parameters:', error);
      this.notificationService.error('Error al cargar los parametros');
    });
  }

  onSearchChange(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  openCreateModal() {
    this.parameterForm.showModal();
  }

  openEditModal(parameter: Parameter) {
    this.parameterForm.showModal(parameter);
  }

  async deleteParameter(parameter: Parameter) {
    if (!parameter?.uidParameter) {
      return;
    }

    try {
      await this.parameterService.deleteParameter(parameter.uidParameter);
      this.notificationService.success(customTextUtil('parameter.deleted', 'Parametro Eliminado'));
      await this.fetchParameters();
    } catch (error) {
      console.error('Error deleting parameter:', error);
      this.notificationService.error('Error al eliminar el parametro');
    }
  }

  onParameterSaved() {
    void this.fetchParameters();
  }
}
