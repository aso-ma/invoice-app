import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSummary } from '../interfaces';

@Component({
  selector: 'invoice-delete-modal',
  templateUrl: 'invoice-delete-modal.component.html'
})
export class InvoiceDeleteModalComponent {

  @Input() invoice!: InvoiceSummary;

  constructor(public activeModal: NgbActiveModal) { }

}
