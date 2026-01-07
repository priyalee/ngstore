import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { SharedService } from '../services/shared.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /* NOTIFICATION */
  showNotificationPrompt = true;

  /* PRODUCTS */
  products: any[] = [];
  filteredProducts: any[] = [];

  /* FILTER STATE */
  searchText: string = '';
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Load all products
    this.loadProducts();

    // Subscribe to category changes
    this.sharedService.category$.subscribe(category => {
      this.selectedCategory = category;
      this.applyFilters();
    });

    // Subscribe to search text changes (live typing)
    this.sharedService.search$.subscribe(query => {
      this.searchText = query.toLowerCase();
      this.applyFilters();
    });
  }

  /* LOAD PRODUCTS */
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data.map(p => ({ ...p, quantity: 1 }));
        this.filteredProducts = [...this.products]; // initial display
      },
      error: err => console.error(err),
    });
  }

  /* APPLY SEARCH & CATEGORY FILTERS */
  private applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const name = p.name || p.title || p.productName || '';
      const matchesSearch = this.searchText ? name.toLowerCase().includes(this.searchText) : true;
      const matchesCategory = this.selectedCategory ? p.category?.toLowerCase() === this.selectedCategory.toLowerCase() : true;
      return matchesSearch && matchesCategory;
    });
  }

  /* QUANTITY */
  increaseQty(p: any): void { p.quantity++; }
  decreaseQty(p: any): void { if (p.quantity > 1) p.quantity--; }

  /* ADD TO CART */
  addToCart(product: any): void {
    this.cartService.addToUiCart(product);
    console.log('🛒 Added to cart:', product);
  }
}
