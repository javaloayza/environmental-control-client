import { Component, inject, OnInit, signal } from '@angular/core';
import { Company } from 'app/company/models/company';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ModalCompanyFormComponent } from "app/company/components";
import { NotificationService } from '@core/services';
import { CompanyTextPipe } from '@shared/pipes';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  imports: [TableModule, ButtonModule, IconFieldModule, InputIcon, InputTextModule, ModalCompanyFormComponent, CompanyTextPipe]
})
export class CompanyListComponent implements OnInit {

  notificationService = inject(NotificationService);

  companies = signal<Company[]>([
    { id: '1', name: 'Company 1', ruc: '12345678', countryId: '1', countryName: 'Peru', stateId: '1', stateName: 'Lima', address: 'Av. Los Olivos 123', zipCode: '15024' },
    { id: '2', name: 'Company 2', ruc: '98765432', countryId: '1', countryName: 'Peru', stateId: '2', stateName: 'Arequipa', address: 'Av. La Republica 456', zipCode: '61600' },
    { id: '3', name: 'Company 3', ruc: '74185296', countryId: '1', countryName: 'Peru', stateId: '3', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '4', name: 'Company 4', ruc: '85236974', countryId: '1', countryName: 'Peru', stateId: '4', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '5', name: 'Company 5', ruc: '96385274', countryId: '1', countryName: 'Peru', stateId: '5', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' },
    { id: '6', name: 'Company 6', ruc: '14785296', countryId: '1', countryName: 'Peru', stateId: '6', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '7', name: 'Company 7', ruc: '25896374', countryId: '1', countryName: 'Peru', stateId: '7', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '8', name: 'Company 8', ruc: '36985274', countryId: '1', countryName: 'Peru', stateId: '8', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' },
    { id: '9', name: 'Company 9', ruc: '85214796', countryId: '1', countryName: 'Peru', stateId: '9', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '10', name: 'Company 10', ruc: '96325874', countryId: '1', countryName: 'Peru', stateId: '10', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '11', name: 'Company 11', ruc: '14796374', countryId: '1', countryName: 'Peru', stateId: '11', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' },
    { id: '12', name: 'Company 12', ruc: '25836974', countryId: '1', countryName: 'Peru', stateId: '12', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '13', name: 'Company 13', ruc: '96385274', countryId: '1', countryName: 'Peru', stateId: '13', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '14', name: 'Company 14', ruc: '85214796', countryId: '1', countryName: 'Peru', stateId: '14', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' },
    { id: '15', name: 'Company 15', ruc: '36985274', countryId: '1', countryName: 'Peru', stateId: '15', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '16', name: 'Company 16', ruc: '25896374', countryId: '1', countryName: 'Peru', stateId: '16', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '17', name: 'Company 17', ruc: '74185296', countryId: '1', countryName: 'Peru', stateId: '17', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' },
    { id: '18', name: 'Company 18', ruc: '85274174', countryId: '1', countryName: 'Peru', stateId: '18', stateName: 'Arequipa', address: 'Av. La Republica 789', zipCode: '61600' },
    { id: '19', name: 'Company 19', ruc: '96374174', countryId: '1', countryName: 'Peru', stateId: '19', stateName: 'Callao', address: 'Av. El Ejercito 123', zipCode: '61600' },
    { id: '20', name: 'Company 20', ruc: '14796374', countryId: '1', countryName: 'Peru', stateId: '20', stateName: 'Lima', address: 'Av. Los Olivos 456', zipCode: '15024' }
  ]);

  constructor() { }

  ngOnInit() {
    this.notificationService.success('Company List Loaded Successfully');
  }

}
