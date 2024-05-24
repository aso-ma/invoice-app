import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-struct';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Customer, Invoice, InvoiceItem, Product } from '../interfaces';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Component({
  selector: 'invoice-form',
  templateUrl: 'invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {

  // @Input() existingInvoice: Invoice | undefined;
  @Output() formSubmitted = new EventEmitter<any>();

  invoice: Invoice | undefined;

  @Input()
  set initialValues(value: Invoice | undefined) {
    this.invoice = value;
    this.patchInvoiceToForm(value!)
  }

  invoiceForm: FormGroup = this.formBuilder.group({
    title: [, Validators.required],
    customerId: [],
    customer: [, Validators.required],
    date: [this.getCurrentDate(), Validators.required],
    time: [this.getCurrentTime(), Validators.required],
    items: this.formBuilder.array([this.createItem()], this.repetitiveProductValidator()),
  });

  customers: Customer[] = [];
  selectedCustomer!: Customer;
  products: Product[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(
      (customers) => {
        this.customers = customers;
      }, 
      (error) => {
        console.error('Error retrieving customers:', error);
      }
    );

    this.productService.getProducts().subscribe(
      (products) => {this.products = products;}
    );
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['existingInvoice'] && changes['existingInvoice'].currentValue) {}
  // }

  private patchInvoiceToForm(invoice: Invoice) {
    this.deleteItem(0); 
      const { date, time } = this.convertToNgbStructs(invoice.created_at!);
      this.invoiceForm.patchValue({
        title: invoice.title,
        customer: invoice.customer,
        customerId: invoice.customer.id,
        date: date,
        time: time
      });
      for (let i = 0; i < invoice.items.length!; i++) {
        const item = invoice.items.at(i);
        this.items.push(
          this.formBuilder.group({
            id: item?.product.id,
            title: [item?.product, Validators.required],
            price: [item?.product.price, [Validators.required, Validators.min(0.01)]],
            count: [item?.count, [Validators.required, Validators.min(1)]]
          })
        );
      }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      id: [], 
      title: [, Validators.required],
      price: [, [Validators.required, Validators.min(0.01)]],
      count: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  deleteItem(index: number): void {
    const items = this.invoiceForm.get('items') as FormArray;
    items.removeAt(index);
  }

  private getCurrentTime(): NgbTimeStruct {
    const now = new Date();
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };
  }

  private getCurrentDate(): NgbDateStruct {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  private repetitiveProductValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (formArray.length === 0) {
        return { emptyArray: true };
      }
      const ids = new Set<number>();
      for (let i = 0; i < formArray.length; i++) {
        const itemFormGroup = formArray.at(i) as FormGroup;
        if (itemFormGroup.get('id')?.value !== null) {
          const id_value = itemFormGroup.get('id')?.value
          if (ids.has(id_value)) {
            return { repetitive_product: {product_id: id_value, index: i} };
          }
          ids.add(id_value);
        }
      }
      return null;
    };
  }

  searchCustomers = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      map(term => {
        return this.customers.filter(customer => customer.name.toLowerCase().includes(term.toLowerCase()));
      })
    );
  };

  searchProducts = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      map(term => {
        return this.products.filter(product => product.title.toLowerCase().includes(term.toLowerCase()));
      })
    );
  };

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.invoiceForm.get('customerId')?.patchValue(customer.id)
    this.invoiceForm.get('customer')?.patchValue(customer.name);    
  }

  onProductSelected(product: Product, index: number) {
    const idInput = this.items.at(index).get('id');
    const priceInput = this.items.at(index).get('price');
    idInput?.patchValue(product.id);
    priceInput?.patchValue(product.price);
  }

  customerFormatter(customer: Customer): string {
    return customer.name;
  }

  productFormatter(product: Product) {
    return product.title
  }

  private convertToNgbStructs(datetime: string): { date: NgbDateStruct; time: NgbTimeStruct } {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dateStruct: NgbDateStruct = { year, month, day };
    const timeStruct: NgbTimeStruct = { hour, minute, second };
  
    return { date: dateStruct, time: timeStruct };
  }

  private dateFormatter(date: NgbDateStruct): string {
    const month = date.month < 10 ? `0${date.month}` : date.month;
    const day = date.day < 10 ? `0${date.day}` : date.day;
    return `${date.year}-${month}-${day}`;
  }

  private timeFormatter(time: NgbTimeStruct): string {
    const hour = time.hour < 10 ? '0' + time.hour : time.hour;
    const minute = time.minute < 10 ? '0' + time.minute : time.minute;
    const second = time.second < 10 ? '0' + time.second : time.second;
    return `${hour}:${minute}:${second}`;
  }

  
  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoice = this.invoiceForm.value;
      const invoiceToSend = {
        title: invoice.title,
        customerId: invoice.customerId,
        created_at: this.dateFormatter(invoice.date)  + 'T' + this.timeFormatter(invoice.time),
        items: invoice.items.map((item: InvoiceItem) => {
          return {productId: item.id, count: item.count}
        })
      };

      this.formSubmitted.emit(invoiceToSend);
    }
  }
  

}
