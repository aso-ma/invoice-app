export interface InvoiceItem {
    id: number;
    product: Product;
    count: number;
}

export interface Invoice {
    id: number;
    title: string;
    customer: Customer;
    items: InvoiceItem[];
    created_at: string;
}

export interface InvoiceSummary {
    id: number;
    title: string;
    customer: string;
    created_at: string;
    total_price: number;
}

export interface MenuItem {
    title: string;
    path: string;
}

export interface IdModel {
    id: number;
}

export interface Product {
    id: number;
    title: string; 
    price: number;
}

export interface Customer {
    id: number;
    name: string;
}

export interface FormError {
    control: string;
    message: string;
}