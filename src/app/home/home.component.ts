import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ProductService } from '../services/product.service';
import { SharedService } from '../services/shared.service';
import { CartService } from '../services/cart.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  /* ================= NOTIFICATION ================= */
  showNotificationPrompt: boolean = true;

  /* ================= PRODUCTS ================= */
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkNotificationPermission();
    this.loadProducts();

    /* Category filter */
    this.sharedService.category$.subscribe(category => {
      this.applyCategoryFilter(category);
    });

    /* Search filter */
    this.sharedService.search$.subscribe(query => {
      this.applySearch(query);
    });
  }

  /* ================= NOTIFICATION LOGIC ================= */

  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      const blocked = localStorage.getItem('notificationsBlocked');

      if (
        Notification.permission === 'granted' ||
        Notification.permission === 'denied' ||
        blocked
      ) {
        this.showNotificationPrompt = false;
      }
    }
  }

  allowNotifications(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🛍️ Thanks for enabling ngStore notifications!');
        }
      });
    }
    this.showNotificationPrompt = false;
  }

  blockNotifications(): void {
    localStorage.setItem('notificationsBlocked', 'true');
    this.showNotificationPrompt = false;
  }

  /* ================= LOAD PRODUCTS ================= */

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data.map(p => ({
          ...p,
          quantity: 1
        }));
        this.filteredProducts = [...this.products];
      },
      error: err => console.error(err),
    });
  }

  /* ================= FILTERS ================= */

  private applyCategoryFilter(category: string | null): void {
    if (!category) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  private applySearch(search: string): void {
    if (!search) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  /* ================= QUANTITY ================= */

  increaseQty(p: any): void {
    p.quantity++;
  }

  decreaseQty(p: any): void {
    if (p.quantity > 1) p.quantity--;
  }

  /* ================= ADD TO CART ================= */

  addToCart(product: any): void {
    this.cartService.addToUiCart(product);
    console.log('🛒 Added to cart:', product);
  }
}
