import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private _baseUrl = 'http://localhost:5292/api/customers/'

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this._baseUrl);
}
}
