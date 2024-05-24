import { Component } from '@angular/core';
import { MenuItem } from './interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css'
})
export class AppComponent {

  title = 'Invoice Management Application';
  
  public menuItems: MenuItem[] = [
    {title: 'Invoice List', path: '/invoices'},
    {title: 'New Invoice', path: '/invoices/new'},
  ]

  constructor(
    private router: Router
  ) {}

  isMenuActive(path: string): string {
    if (this.router.url === path) {
      return 'nav-link active'
    } else {
      return 'nav-link text-secondary'
    }
  }

}
