import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '@core/services/cart.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  promo = '';
  promoApplied = false;

  private readonly FREE_SHIP_THRESHOLD = 50;
  private readonly SHIP_FEE = 4.99;
  private readonly TAX_RATE = 0.08;

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.getUiCart().subscribe(items => (this.items = items));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /* quantities */
  inc(item: CartItem): void { this.cartService.increment(item.id); }
  dec(item: CartItem): void { this.cartService.decrement(item.id); }
  remove(item: CartItem): void {
    this.cartService.removeFromUiCart(item.id);
    this.toast.show('Removed from cart', 'info', 'fa-solid fa-trash-can');
  }

  /* totals */
  get subtotal(): number {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
  get promoDiscount(): number {
    return this.promoApplied ? this.subtotal * 0.1 : 0;
  }
  get shipping(): number {
    if (!this.items.length) return 0;
    return this.subtotal - this.promoDiscount >= this.FREE_SHIP_THRESHOLD ? 0 : this.SHIP_FEE;
  }
  get tax(): number {
    return (this.subtotal - this.promoDiscount) * this.TAX_RATE;
  }
  get total(): number {
    return this.subtotal - this.promoDiscount + this.shipping + this.tax;
  }
  get freeShipRemaining(): number {
    return Math.max(0, this.FREE_SHIP_THRESHOLD - (this.subtotal - this.promoDiscount));
  }
  get freeShipProgress(): number {
    return Math.min(100, ((this.subtotal - this.promoDiscount) / this.FREE_SHIP_THRESHOLD) * 100);
  }

  applyPromo(): void {
    if (this.promo.trim().toUpperCase() === 'NG10') {
      this.promoApplied = true;
      this.toast.show('Promo NG10 applied — 10% off', 'success', 'fa-solid fa-tag');
    } else {
      this.promoApplied = false;
      this.toast.show('Invalid promo code', 'error', 'fa-solid fa-circle-exclamation');
    }
  }
}
