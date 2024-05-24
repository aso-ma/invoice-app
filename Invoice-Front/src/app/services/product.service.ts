import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "../interfaces";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private _baseUrl = 'http://localhost:5292/api/products/'

    constructor (
        private http: HttpClient
    ) {}

    getProducts() {
        return this.http.get<Product[]>(this._baseUrl);
    }
}