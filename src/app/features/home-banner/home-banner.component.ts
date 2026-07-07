import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit, OnDestroy {
  deals: any[] = [];
  trending: any[] = [];
  loading = true;

  hours = 0;
  minutes = 0;
  seconds = 0;
  private timer?: any;

  skeletons = Array(8);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.startCountdown();

    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        // "deals" — biggest real discounts get the spotlight
        this.deals = [...data].sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)).slice(0, 8);
        this.trending = [...data].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)).slice(0, 4);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private startCountdown(): void {
    // Ends at the next midnight
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      let diff = Math.floor((end.getTime() - now.getTime()) / 1000);
      this.hours = Math.floor(diff / 3600);
      this.minutes = Math.floor((diff % 3600) / 60);
      this.seconds = diff % 60;
    };
    tick();
    this.timer = setInterval(tick, 1000);
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
