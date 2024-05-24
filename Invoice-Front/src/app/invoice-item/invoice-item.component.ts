import { Component, OnInit } from '@angular/core';
import { Invoice, InvoiceItem } from '../interfaces';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoice-item',
  templateUrl: 'invoice-item.component.html'
})
export class InvoiceItemComponent implements OnInit {

  invoice: Invoice | undefined;

  constructor(
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

  getTotalPrice() {
    let sum: number = 0;
    this.invoice?.items.forEach(item => {
      sum += item.product.price * item.count;
    });
    return sum.toFixed(2);
  }

}
