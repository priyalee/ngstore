import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '@core/services/wishlist.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  items: any[] = [];
  private sub?: Subscription;

  constructor(private wishlist: WishlistService) {}

  ngOnInit(): void {
    this.sub = this.wishlist.getAll().subscribe(items => (this.items = items));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  clear(): void {
    this.wishlist.clear();
  }

  trackById(_: number, p: any) { return p.id; }
}
