import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NotificationService } from '@core/services';
import { TextPipe } from '@shared/pipes';
import { Parameter } from '../../models';
import { ParameterService } from '../../services';

@Component({
  selector: 'app-modal-parameter-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    TextPipe
  ],
  templateUrl: './modal-parameter-form.component.html',
  styleUrls: ['./modal-parameter-form.component.scss']
})
export class ModalParameterFormComponent {
  @Output() saved = new EventEmitter<void>();

  private parameterService = inject(ParameterService);
  private notificationService = inject(NotificationService);

  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  mode: 'Create' | 'Update' = 'Create';
  selectedParameter: Parameter | null = null;

  statusOptions = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 }
  ];

  parameterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    defaultUnit: new FormControl('', [Validators.required]),
    status: new FormControl(1, [Validators.required])
  });

  showModal(parameter?: Parameter) {
    this.mode = parameter ? 'Update' : 'Create';
    this.selectedParameter = parameter || null;
    
    if (parameter) {
      this.parameterForm.patchValue({
        name: parameter.name,
        description: parameter.description,
        defaultUnit: parameter.defaultUnit,
        status: parameter.status
      });
    } else {
      this.parameterForm.reset({ status: 1 });
    }
    
    this.visible.set(true);
  }

  hideModal() {
    this.visible.set(false);
  }

  saveParameter() {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      return;
    }

    const formValue = this.parameterForm.value;
    const parameterData: Partial<Parameter> = {
      name: formValue.name!,
      description: formValue.description!,
      defaultUnit: formValue.defaultUnit!,
      status: formValue.status!
    };

    this.loading.set(true);
    const request = this.mode === 'Create' 
      ? this.parameterService.createParameter(parameterData)
      : this.parameterService.updateParameter({ ...this.selectedParameter, ...parameterData } as Parameter);

    request
      .then(() => {
        this.notificationService.success(
          this.mode === 'Create' ? 'Parámetro creado correctamente' : 'Parámetro actualizado correctamente'
        );
        this.saved.emit();
        this.hideModal();
      })
      .catch(error => {
        console.error('Error saving parameter:', error);
        this.notificationService.error(
          this.mode === 'Create' 
            ? 'Error al crear el parámetro'
            : 'Error al actualizar el parámetro'
        );
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
}
