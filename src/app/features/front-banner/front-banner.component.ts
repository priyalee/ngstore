import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { NotificationService } from '@core/services/notification.service';
import { ProductService } from '@core/services/product.service';
import { SharedService } from '@core/services/shared.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

interface CategoryTile { name: string; image: string; count: number; }

@Component({
  selector: 'app-front-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, TranslatePipe],
  templateUrl: './front-banner.component.html',
  styleUrls: ['./front-banner.component.scss']
})
export class FrontBannerComponent implements OnInit {
  showNotificationPrompt = false;
  featured: any[] = [];
  topDeals: any[] = [];
  categories: CategoryTile[] = [];
  totalProducts = 0;
  loading = true;

  perks = [
    { icon: 'fa-truck-fast', title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: 'fa-rotate-left', title: '30-Day Returns', desc: 'Hassle-free refunds' },
    { icon: 'fa-lock', title: 'Secure Payment', desc: '100% protected checkout' },
    { icon: 'fa-headset', title: '24/7 Support', desc: 'Always here to help' },
  ];

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.totalProducts = data.length;
        const sorted = [...data].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        this.featured = sorted.slice(0, 8);
        this.topDeals = [...data].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 4);
        this.categories = this.buildCategories(data);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    this.notificationService.showPrompt$.subscribe(show => (this.showNotificationPrompt = show));
    this.notificationService.showPrompt();
  }

  private buildCategories(data: any[]): CategoryTile[] {
    const map = new Map<string, CategoryTile>();
    for (const p of data) {
      const c = p.category;
      if (!map.has(c)) map.set(c, { name: c, image: p.image, count: 0 });
      map.get(c)!.count++;
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }

  goToCategory(key: string): void {
    this.sharedService.setCategory(key);
  }

  allowNotifications(): void { this.notificationService.allowNotifications(); }
  blockNotifications(): void { this.notificationService.blockNotifications(); }
}
