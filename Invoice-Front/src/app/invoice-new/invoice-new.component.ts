import { Component } from '@angular/core';
import { IdModel } from '../interfaces';
import { InvoiceService } from '../services/invoice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-invoice',
  templateUrl: 'invoice-new.component.html'
})
export class InvoiceNewComponent {

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  onFormSubmitted(invoiceToSend: string) {
    this.invoiceService.createInvoice(JSON.stringify(invoiceToSend)).subscribe(
      (response: IdModel) => {this.router.navigate([`/invoices/${response.id}`])}
    );

  }

}
