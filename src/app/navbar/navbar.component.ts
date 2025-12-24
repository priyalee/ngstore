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

  loadCategories(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.categories = Array.from(
          new Set(data.map((p: any) => p.category))
        ).filter(Boolean);
      },
      error: err => console.error(err)
    });
  }

  loadCarts(): void {
    this.cartService.getAll().subscribe({
      next: res => (this.carts = res),
      error: err => console.error(err)
    });
  }

  filterByCategory(category: string): void {
    this.sharedService.setCategory(category);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('bg-dark', this.isDarkMode);
    document.body.classList.toggle('text-white', this.isDarkMode);
  }

  setLocation(location: string): void {
    this.currentLocation = location;
  }

  onSearch(query: string): void {
    const value = query.trim();
    console.log('🔍 Navbar search:', value);

    if (!value) return;

    this.sharedService.setSearch(value);
  }
}
