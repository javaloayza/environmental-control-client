import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { COMPANY_STRING_ROUTES } from 'app/company/constants';
import { REGULATION_STRING_ROUTES } from 'app/regulation/constants';
import { LOCATION_STRING_ROUTES } from 'app/location/constants';
import { MONITORING_TYPE_STRING_ROUTES } from 'app/monitoring-type/constants';
import { SPECIFIC_LOCATION_STRING_ROUTES } from 'app/specific-location/constants';
import { STANDARD_STRING_ROUTES } from 'app/standard/constants';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Modules',
                items: [
                    { label: 'Companies', icon: 'pi pi-fw pi-building', routerLink: [COMPANY_STRING_ROUTES.ROOT] },
                    { label: 'Regulaciones', icon: 'pi pi-fw pi-book', routerLink: [REGULATION_STRING_ROUTES.ROOT] },
                    { label: 'Ubicaciones', icon: 'pi pi-fw pi-map-marker', routerLink: [LOCATION_STRING_ROUTES.ROOT] },
                    { label: 'Tipos de Monitoreo', icon: 'pi pi-fw pi-list', routerLink: [MONITORING_TYPE_STRING_ROUTES.ROOT] },
                    { label: 'Ubicaciones Especificas', icon: 'pi pi-fw pi-map', routerLink: [SPECIFIC_LOCATION_STRING_ROUTES.ROOT] },
                    { label: 'Parametros', icon: 'pi pi-fw pi-sliders-h', routerLink: [STANDARD_STRING_ROUTES.ROOT] }
                ]
            },
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            }
        ];
    }
}
