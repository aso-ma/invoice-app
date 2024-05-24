import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdModel, Invoice, InvoiceSummary } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  _baseURL = "http://localhost:5292/api/invoices/";

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  getInvoices(): Observable<InvoiceSummary[]> {
    return this.http.get<InvoiceSummary[]>(this._baseURL);
  }

  getInvoiceById(id: number): Observable<Invoice | undefined>  {
    return this.http.get<Invoice>(this._baseURL+id);
  }

  createInvoice(invoice: string) {
    return this.http.post<IdModel>(this._baseURL, invoice, this.httpOptions);
  }

  updateInvoice(invoiceId: number, invoice: string) {
    return this.http.put<IdModel>(this._baseURL+invoiceId, invoice, this.httpOptions)
  }

  deleteInvoice(invoiceId: number) {
    return this.http.delete(this._baseURL+invoiceId, { observe: 'response' })
  }
  
}
