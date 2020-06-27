import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreateModalComponent } from './create-modal/create-modal.component';

@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.scss']
})
export class CreateButtonComponent implements OnInit {

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
    this.config.windowClass = 'modal-100';
  }

  ngOnInit(): void {
  }

  openCreateModal(): void {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'modal-100'
    }
    const modalRef = this.modalService.open(CreateModalComponent, modalOptions);
    modalRef.result.then((closeReason?: string) => {
      switch (closeReason) {
        case 'payment-success':
          console.log('payment-success');
      }
    }, (dismissReason?) => {});
  }

}
