import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { SharedService } from '../services/shared.service';
import { CartService } from '../services/cart.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,NavbarComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Listen to category changes
    this.sharedService.category$.subscribe(category => {
      this.applyCategoryFilter(category);
    });
    

    // Listen to search changes
    this.sharedService.search$.subscribe(search => {
      this.applySearch(search);
    });
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

  /* ================= FILTER ================= */

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
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  /* ================= QUANTITY ================= */

  increaseQty(p: any): void {
    p.quantity++;
  }

  decreaseQty(p: any): void {
    if (p.quantity > 1) {
      p.quantity--;
    }
  }

  /* ================= ADD TO CART ================= */

  addToCart(product: any): void {
    this.cartService.addToUiCart(product);
    console.log('🛒 Added to cart:', product);
  }
}
