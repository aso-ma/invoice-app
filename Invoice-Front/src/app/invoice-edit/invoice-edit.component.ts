import { Component, OnInit } from '@angular/core';
import { IdModel, Invoice, InvoiceItem } from '../interfaces';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-struct';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: 'invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

  invoice: Invoice | undefined;

  constructor (
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const invoiceId = params['id'];
        return this.invoiceService.getInvoiceById(invoiceId);
      })
    ).subscribe(invoice => {
      this.invoice = invoice;
    });
  }

  onFormSubmitted(invoiceToSend: string) {
    this.invoiceService.updateInvoice(
      this.invoice?.id!, JSON.stringify(invoiceToSend)
    ).subscribe((response: IdModel) => {
      this.router.navigate([`/invoices/${response.id}`])
    });

  }

}
