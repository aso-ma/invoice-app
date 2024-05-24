import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { FormError } from '../interfaces';

@Component({
  selector: 'invoice-form-error',
  templateUrl: 'invoice-form-error.component.html'
})
export class InvoiceFormErrorComponent {
  
  @Input() formGroup: FormGroup = new FormGroup({});

  getErrors() {
    console.warn("getErrors()");
    
    const formErrors: FormError[] = [];
    ['title', 'customer'].forEach(controlName => {
      const control = this.formGroup.get(controlName);
      if (control?.errors) {
        Object.keys(control.errors).forEach(errorName => {
          formErrors.push(
            {
              control: controlName, message: this.getMessageFor(errorName)
            }
          );
        });
      }
    });

    if (!this.formGroup.contains('customerId') || this.formGroup.get('customerId')?.value == null) {
      formErrors.push({control: "customer", message: "not selected"});
    }

    const items = this.formGroup.get('items') as FormArray;

    if(items?.errors?.['emptyArray']) {
      formErrors.push({control: `items`, message: "no producted has been added."});
    }

    if(items?.errors?.['repetitive_product']) {
      formErrors.push({control: `item-${this.addSuffixToNumber(items?.errors?.['repetitive_product'].index +1)}`, message: "repetitive product."});
    }

    for (let i = 0; i < items.length; i++) {
      const itemFormGroup = items.at(i) as FormGroup;

      if (!itemFormGroup.contains('id') || itemFormGroup.get('id')?.value == null) {
        formErrors.push({control: `item-${this.addSuffixToNumber(i+1)}-product`, message: "not selected"});
      }

      Object.keys(itemFormGroup.controls).forEach(controlName => {
        const control = itemFormGroup.get(controlName);
        if (control?.errors) {
          Object.keys(control.errors).forEach(errorName => {
            formErrors.push({
              control: `item-${this.addSuffixToNumber(i+1)}-${controlName}`, message: this.getMessageFor(errorName)
            });
          });
        }
      });    
    }

    return formErrors;
  }

  private addSuffixToNumber(number: number): string {
    const lastDigit = number % 10;
    if (lastDigit === 1) {
      return number.toString() + 'st';
    } else if (lastDigit === 2) {
      return number.toString() + 'nd';
    } else if (lastDigit === 3) {
      return number.toString() + 'rd';
    } else {
      return number.toString() + 'th';
    }
  }

  private getMessageFor(errorName: string): string {
    if (errorName == 'required') {
      return "must not be empty";
    } else if(errorName == 'min') {
      return "must not be equal or less than zero";
    } else {
      return "invaild";
    }
  }


}
