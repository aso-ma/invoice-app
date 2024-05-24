import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceNewComponent } from './invoice-new/invoice-new.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';

const routes: Routes = [
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceNewComponent },
  { path: 'invoices/:id', component: InvoiceItemComponent },
  { path: 'invoices/edit/:id', component: InvoiceEditComponent },
  { path: '', redirectTo: '/invoices', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
