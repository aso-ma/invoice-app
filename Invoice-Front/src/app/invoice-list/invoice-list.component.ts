import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { Invoice, InvoiceSummary } from '../interfaces';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceDeleteModalComponent } from '../invoice-delete-modal/invoice-delete-modal.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: 'invoice-list.component.html'
})
export class InvoiceListComponent implements OnInit {
  public invoices: InvoiceSummary[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoices = data
    });
  }

  openDeleteModal(invoice: InvoiceSummary) {
    const modalRef = this.modalService.open(InvoiceDeleteModalComponent);
    modalRef.componentInstance.invoice = invoice;
    modalRef.result.then((result) => {
      if(result) {
        this.deleteInvoice(invoice.id);
      }
    }).catch((error) => {
      console.log(`Dismissed ${error}`);
    });
  }

  deleteInvoice(invoiceId: number) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe(response => {
      if (response.status == 200) {
        this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId);  
      }
    }
    );
  }

}
