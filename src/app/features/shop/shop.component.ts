import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filtered: any[] = [];
  categories: string[] = [];
  loading = true;

  selectedCats = new Set<string>();
  maxPrice = 1000;
  priceCeiling = 1000;
  minRating = 0;
  sortBy = 'featured';
  filtersOpen = false;

  private readonly pageSize = 24;
  visibleCount = this.pageSize;

  skeletons = Array(9);
  private productsLoaded = false;
  private sub?: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // URL is the source of truth — restores filters on load & browser back/forward.
    this.sub = this.route.queryParamMap.subscribe(pm => {
      const cats = pm.get('cats');
      this.selectedCats = new Set(cats ? cats.split(',') : []);
      this.sortBy = pm.get('sort') || 'featured';
      this.minRating = pm.get('rating') ? +pm.get('rating')! : 0;
      this.maxPrice = pm.get('max') ? +pm.get('max')! : this.priceCeiling;
      if (this.productsLoaded) this.applyFilters();
    });

    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.categories = Array.from(new Set(data.map(p => p.category))).filter(Boolean);
        this.priceCeiling = Math.ceil(Math.max(...data.map(p => p.price)) / 10) * 10;
        const maxParam = this.route.snapshot.queryParamMap.get('max');
        if (!maxParam) this.maxPrice = this.priceCeiling;
        this.productsLoaded = true;
        this.applyFilters();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  private syncUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        cats: this.selectedCats.size ? [...this.selectedCats].join(',') : null,
        sort: this.sortBy !== 'featured' ? this.sortBy : null,
        max: this.maxPrice < this.priceCeiling ? this.maxPrice : null,
        rating: this.minRating || null,
      },
      replaceUrl: true,
    });
  }

  toggleCat(cat: string): void {
    this.selectedCats.has(cat) ? this.selectedCats.delete(cat) : this.selectedCats.add(cat);
    this.applyFilters();
    this.syncUrl();
  }

  setRating(r: number): void {
    this.minRating = this.minRating === r ? 0 : r;
    this.applyFilters();
    this.syncUrl();
  }

  onSort(): void { this.applyFilters(); this.syncUrl(); }
  onPriceInput(): void { this.applyFilters(); }
  onPriceChange(): void { this.syncUrl(); }

  clearAll(): void {
    this.selectedCats.clear();
    this.maxPrice = this.priceCeiling;
    this.minRating = 0;
    this.sortBy = 'featured';
    this.applyFilters();
    this.syncUrl();
  }

  get activeFilterCount(): number {
    let n = this.selectedCats.size + (this.minRating ? 1 : 0);
    if (this.maxPrice < this.priceCeiling) n++;
    return n;
  }

  applyFilters(): void {
    let list = this.products.filter(p => {
      const catOk = this.selectedCats.size ? this.selectedCats.has(p.category) : true;
      const priceOk = p.price <= this.maxPrice;
      const rateOk = (p.rating?.rate ?? 0) >= this.minRating;
      return catOk && priceOk && rateOk;
    });

    switch (this.sortBy) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)); break;
    }
    this.filtered = list;
    this.visibleCount = this.pageSize;
  }

  get visibleProducts(): any[] {
    return this.filtered.slice(0, this.visibleCount);
  }

  loadMore(): void {
    this.visibleCount += this.pageSize;
  }

  trackById(_: number, p: any) { return p.id; }
}
