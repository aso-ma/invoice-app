import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbAccordionModule, NgbDatepicker, NgbModalModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceNewComponent } from './invoice-new/invoice-new.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceFormErrorComponent } from './invoice-form-error/invoice-form-error.component';
import { InvoiceDeleteModalComponent } from './invoice-delete-modal/invoice-delete-modal.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceNewComponent,
    InvoiceItemComponent,
    InvoiceFormErrorComponent,
    InvoiceDeleteModalComponent,
    InvoiceFormComponent,
    InvoiceEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbTypeaheadModule,
    NgbDatepicker,
    NgbTimepickerModule,
    NgbAccordionModule,
    NgbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
