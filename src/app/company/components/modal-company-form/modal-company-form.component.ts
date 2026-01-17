import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modal-company-form',
  templateUrl: './modal-company-form.component.html',
  styleUrls: ['./modal-company-form.component.scss'],
  imports: [DialogModule, InputTextModule, ButtonModule]
})
export class ModalCompanyFormComponent implements OnInit {
  mode: 'Create' | 'Update' = 'Create';
  visible = false;

  constructor() { }

  ngOnInit() {
  }

  showModal() {
    this.visible = true;
  }

  hideModal() {
    this.visible = false;
  }

}
