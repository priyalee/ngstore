import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { SharedService } from '@core/services/shared.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  loading = true;

  searchText = '';
  selectedCategory: string | null = null;
  sortBy = 'featured';

  private readonly pageSize = 24;
  visibleCount = this.pageSize;

  skeletons = Array(8);

  constructor(
    private productService: ProductService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.sharedService.category$.subscribe(category => {
      this.selectedCategory = category;
      this.applyFilters();
    });

    this.sharedService.search$.subscribe(query => {
      this.searchText = (query || '').toLowerCase();
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.categories = Array.from(new Set(data.map(p => p.category))).filter(Boolean);
        this.applyFilters();
        this.loading = false;
      },
      error: err => { console.error(err); this.loading = false; },
    });
  }

  selectCategory(cat: string | null): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.products.filter(p => {
      const name = (p.title || '').toLowerCase();
      const matchesSearch = this.searchText ? name.includes(this.searchText) : true;
      const matchesCategory = this.selectedCategory
        ? p.category?.toLowerCase() === this.selectedCategory.toLowerCase()
        : true;
      return matchesSearch && matchesCategory;
    });

    switch (this.sortBy) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)); break;
    }
    this.filteredProducts = list;
    this.visibleCount = this.pageSize;
  }

  get visibleProducts(): any[] {
    return this.filteredProducts.slice(0, this.visibleCount);
  }

  loadMore(): void {
    this.visibleCount += this.pageSize;
  }

  trackById(_: number, p: any) { return p.id; }
}
