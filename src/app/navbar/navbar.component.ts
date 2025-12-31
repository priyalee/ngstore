import { ThemeService } from './../services/theme.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  categories: string[] = [];
  carts: any[] = [];
  currentLocation = 'Select Location';
  isDarkMode = false;

  searchQuery: string = '';

  // Language selector
  languages = [
    { label: 'English', value: 'en' },
    { label: 'हिंदी', value: 'hi' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' },
    { label: 'العربية', value: 'ar' },
  ];
  selectedLanguage = 'en';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private sharedService: SharedService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCarts();

    // Subscribe to dark mode changes
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      document.body.classList.toggle('bg-dark', this.isDarkMode);
      document.body.classList.toggle('text-white', this.isDarkMode);
    });
  }

  loadCategories(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.categories = Array.from(
          new Set(data.map((p: any) => p.category))
        ).filter(Boolean);
      },
      error: (err) => console.error(err),
    });
  }

  loadCarts(): void {
    this.cartService.getAll().subscribe({
      next: (res) => (this.carts = res),
      error: (err) => console.error(err),
    });
  }

  filterByCategory(category: string): void {
    this.sharedService.setCategory(category);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('bg-dark', this.isDarkMode);
    document.body.classList.toggle('text-white', this.isDarkMode);
    this.themeService.setDarkMode(this.isDarkMode);
  }

  setLocation(location: string): void {
    this.currentLocation = location;
  }

  onSearch(): void {
    const value = this.searchQuery.trim();
    this.sharedService.setSearch(value);
  }

  onLanguageChange(lang: string) {
    this.selectedLanguage = lang;
    console.log('Language changed to:', lang);
  }

  getLanguageLabel(value: string): string {
    const lang = this.languages.find((l) => l.value === value);
    return lang ? lang.label : 'Choose Language';
  }

  openLanguageModal() {
    const modalEl = document.getElementById('languageModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
  saveLanguage() {
    console.log('Selected language:', this.selectedLanguage);
  }
}

