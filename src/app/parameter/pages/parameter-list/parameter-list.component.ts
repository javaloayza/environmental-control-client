import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { Parameter } from '../../models';
import { ModalParameterFormComponent } from '../../components/modal-parameter-form/modal-parameter-form.component';
import { ParameterService } from '../../services';

@Component({
  selector: 'app-parameter-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIcon,
    InputTextModule,
    ConfirmDialogModule,
    TextPipe,
    ModalParameterFormComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  @ViewChild('parameterForm') parameterForm!: ModalParameterFormComponent;

  private parameterService = inject(ParameterService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  parameters = signal<Parameter[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.parameterService.getParameters()
      .then(data => {
        this.parameters.set(data);
      })
      .catch(error => {
        console.error('Error fetching parameters:', error);
        this.notificationService.error('Error al cargar los parámetros');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  openCreateModal() {
    this.parameterForm.showModal();
  }

  openEditModal(parameter: Parameter) {
    this.parameterForm.showModal(parameter);
  }

  onDelete(parameter: Parameter) {
    if (!parameter.uidParameter) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el parámetro ${parameter.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.parameterService.deleteParameter(parameter.uidParameter!)
          .then(() => {
            this.notificationService.success('Parámetro eliminado correctamente');
            this.fetchData();
          })
          .catch(error => {
            console.error('Error deleting parameter:', error);
            this.notificationService.error('Error al eliminar el parámetro');
          });
      }
    });
  }

  onParameterSaved() {
    this.fetchData();
  }
}
