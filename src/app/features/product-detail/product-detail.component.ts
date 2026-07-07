import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { ToastService } from '@core/services/toast.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any = null;
  related: any[] = [];
  loading = true;
  notFound = false;

  quantity = 1;
  wished = false;
  activeTab: 'description' | 'reviews' | 'shipping' = 'description';
  selectedImage = '';

  private sub?: Subscription;

  private reviewers = [
    { name: 'Aarav S.', text: 'Exactly as described and shipped fast. Really happy with the quality.' },
    { name: 'Meera K.', text: 'Great value for the price. Would order again without hesitation.' },
    { name: 'Daniel R.', text: 'Good product overall, packaging could be a little better.' },
    { name: 'Priya N.', text: 'Absolutely love it — exceeded my expectations. Highly recommend!' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlist: WishlistService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap
      .pipe(switchMap(params => {
        this.loading = true;
        this.notFound = false;
        this.quantity = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return this.productService.getById(Number(params.get('id')));
      }))
      .subscribe(product => {
        this.loading = false;
        if (!product) { this.notFound = true; return; }
        this.product = product;
        this.selectedImage = product.images?.[0] || product.image;
        this.wished = this.wishlist.has(product.id);
        this.activeTab = 'description';
        this.productService.getRelated(product.category, product.id, 4)
          .subscribe(r => (this.related = r));
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get discount(): number {
    return Math.round(this.product?.discountPercentage ?? 0);
  }
  get originalPrice(): number {
    return this.product?.originalPrice ?? this.product?.price;
  }
  get stars(): string[] {
    const rate = this.product?.rating?.rate ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      if (rate >= i + 1) return 'fa-solid fa-star';
      if (rate >= i + 0.5) return 'fa-solid fa-star-half-stroke';
      return 'fa-regular fa-star';
    });
  }
  get stock(): number {
    return this.product?.stock ?? 0;
  }
  get lowStock(): boolean {
    return this.stock > 0 && this.stock <= 10;
  }
  get deliveryDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d;
  }
  get savings(): number {
    return this.originalPrice - this.product.price;
  }

  /** Real reviews from the API when present; otherwise a few deterministic ones. */
  get reviews() {
    if (this.product?.reviews?.length) {
      return this.product.reviews.map((r: any) => ({
        name: r.name || 'Verified Buyer',
        rating: r.rating ?? 5,
        text: r.comment,
      }));
    }
    const rate = Math.round(this.product?.rating?.rate ?? 4);
    return this.reviewers.map((r, i) => ({
      ...r,
      rating: Math.max(3, Math.min(5, rate + (i % 2 === 0 ? 0 : -1))),
    }));
  }

  selectImage(img: string): void { this.selectedImage = img; }

  inc(): void { if (this.quantity < this.stock) this.quantity++; }
  dec(): void { if (this.quantity > 1) this.quantity--; }

  addToCart(): void {
    this.cartService.addToUiCart(this.product, this.quantity);
    this.toast.cart(`Added ${this.quantity} × "${this.product.title.slice(0, 24)}…" to cart`);
  }

  buyNow(): void {
    this.cartService.addToUiCart(this.product, this.quantity);
    this.router.navigate(['/checkout']);
  }

  toggleWish(): void {
    this.wished = this.wishlist.toggle(this.product);
    this.toast.show(this.wished ? 'Saved to wishlist' : 'Removed from wishlist', 'info',
      this.wished ? 'fa-solid fa-heart' : 'fa-regular fa-heart');
  }
}
