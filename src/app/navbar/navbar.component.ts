import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  categories: string[] = [];
  carts: any[] = [];
  currentLocation = 'Select Location';
  isDarkMode = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCarts();
  }

  //  Fetch product categories dynamically from ProductService
  loadCategories(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        // Extract unique categories safely
        this.categories = Array.from(new Set(data.map(p => p.category))).filter(Boolean);
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  // Fetch cart data for badge count
  loadCarts(): void {
    this.cartService.getAll().subscribe({
      next: (res) => (this.carts = res),
      error: (err) => console.error('Failed to load cart data:', err)
    });
  }

  //  When a category is clicked, inform HomeComponent via SharedService
  filterByCategory(category: string): void {
    console.log('Selected category:', category);
    this.sharedService.selectCategory(category);
  }

  //  Toggle dark/light theme
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    document.body.classList.toggle('bg-dark', this.isDarkMode);
    document.body.classList.toggle('text-white', this.isDarkMode);
  }

  //  Update selected location
  setLocation(location: string): void {
    this.currentLocation = location;
  }
}
