import { ThemeService } from '@core/services/theme.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { SharedService } from '@core/services/shared.service';
import { CartUiService } from '@core/services/cart-ui.service';
import { WishlistService } from '@core/services/wishlist.service';
import { AuthService, AuthState } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService, Lang } from '@core/services/translation.service';
import { ProfileService, Profile } from '@core/services/profile.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  categories: string[] = [];
  private allProducts: any[] = [];
  suggestions: any[] = [];
  showSuggestions = false;

  cartCount = 0;
  wishCount = 0;
  isDarkMode = false;
  searchQuery = '';
  menuOpen = false;
  auth: AuthState = { loggedIn: false, guest: false, username: null };

  locations = ['Bangalore', 'Gurugram', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
  locationOpen = false;
  customCity = '';
  profile: Profile = { name: '', location: 'Bangalore', pincode: '', phone: '', address: '', state: '' };

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
    private themeService: ThemeService,
    private cartUi: CartUiService,
    private wishlist: WishlistService,
    private authService: AuthService,
    private toast: ToastService,
    private i18n: TranslationService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.selectedLanguage = this.i18n.lang;
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.categories = Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean);
      },
      error: (err) => console.error(err),
    });
    this.cartService.count$.subscribe(count => (this.cartCount = count));
    this.wishlist.count$.subscribe(count => (this.wishCount = count));
    this.themeService.darkMode$.subscribe(isDark => (this.isDarkMode = isDark));
    this.authService.authState$.subscribe(state => (this.auth = state));
    this.profileService.profile$.subscribe(p => (this.profile = p));
  }

  toggleLocation(): void {
    this.locationOpen = !this.locationOpen;
  }

  selectLocation(loc: string): void {
    this.profileService.setLocation(loc);
    this.locationOpen = false;
    this.toast.show(`Delivering to ${loc}`, 'success', 'fa-solid fa-location-dot');
  }

  addCustomLocation(): void {
    const city = this.customCity.trim();
    if (!city) return;
    this.selectLocation(city);
    this.customCity = '';
  }

  /** Prefer the saved profile name, fall back to the login username. */
  get greetName(): string {
    return this.profile.name || this.auth.username || 'there';
  }

  get userInitial(): string {
    return (this.greetName || 'U').charAt(0).toUpperCase();
  }

  get currentLang(): string {
    return this.i18n.lang;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
    this.router.navigate(['/signin']);
  }

  filterByCategory(category: string | null): void {
    this.sharedService.setCategory(category);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  /* ---- Search + autocomplete ---- */
  onSearchInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (q.length < 2) { this.suggestions = []; this.showSuggestions = false; return; }
    this.suggestions = this.allProducts
      .filter(p => p.title.toLowerCase().includes(q))
      .slice(0, 6);
    this.showSuggestions = this.suggestions.length > 0;
  }

  onSearch(): void {
    this.showSuggestions = false;
    this.menuOpen = false;
    this.sharedService.setCategory(null);
    this.sharedService.setSearch(this.searchQuery.trim());
    this.router.navigate(['/home']);
  }

  selectSuggestion(p: any): void {
    this.showSuggestions = false;
    this.searchQuery = '';
    this.router.navigate(['/product', p.id]);
  }

  hideSuggestionsSoon(): void {
    setTimeout(() => (this.showSuggestions = false), 180);
  }

  /* ---- Cart drawer ---- */
  openCart(): void {
    this.cartUi.open();
    this.menuOpen = false;
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  getLanguageLabel(value: string): string {
    return this.languages.find(l => l.value === value)?.label ?? 'Language';
  }

  openLanguageModal(): void {
    this.selectedLanguage = this.i18n.lang;
    const modalEl = document.getElementById('languageModal');
    if (!modalEl) return;
    new bootstrap.Modal(modalEl).show();
  }

  saveLanguage(): void {
    this.i18n.setLang(this.selectedLanguage as Lang);
    const label = this.languages.find(l => l.value === this.selectedLanguage)?.label ?? this.selectedLanguage;
    this.toast.show(`Language set to ${label}`, 'success', 'fa-solid fa-globe');
  }
}
