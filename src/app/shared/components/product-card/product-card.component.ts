import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { ToastService } from '@core/services/toast.service';
import { WishlistService } from '@core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  wished = false;
  justAdded = false;

  constructor(
    private cartService: CartService,
    private toast: ToastService,
    private wishlist: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wished = this.wishlist.has(this.product?.id);
  }

  get discount(): number {
    return Math.round(this.product?.discountPercentage ?? 0);
  }

  get originalPrice(): number {
    return this.product?.originalPrice ?? this.product?.price;
  }

  get isBestseller(): boolean {
    return (this.product?.rating?.rate ?? 0) >= 4.5;
  }

  get lowStock(): boolean {
    const s = this.product?.stock;
    return s != null && s > 0 && s <= 10;
  }

  /** Five complete Font Awesome class strings from the rating value. */
  get stars(): string[] {
    const rate = this.product?.rating?.rate ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      if (rate >= i + 1) return 'fa-solid fa-star';
      if (rate >= i + 0.5) return 'fa-solid fa-star-half-stroke';
      return 'fa-regular fa-star';
    });
  }

  open(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.addToUiCart(this.product, 1);
    this.toast.cart(`Added "${this.trimTitle(this.product.title)}" to cart`);
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 1400);
  }

  toggleWish(event: Event): void {
    event.stopPropagation();
    this.wished = this.wishlist.toggle(this.product);
    this.toast.show(
      this.wished ? 'Saved to wishlist' : 'Removed from wishlist',
      'info',
      this.wished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
    );
  }

  private trimTitle(t: string): string {
    return t?.length > 28 ? t.slice(0, 28) + '…' : t;
  }
}
