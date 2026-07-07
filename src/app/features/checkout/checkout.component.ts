import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '@core/services/cart.service';
import { OrderService, Order } from '@core/services/order.service';
import { ToastService } from '@core/services/toast.service';
import { ProfileService } from '@core/services/profile.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  step = 1;
  placing = false;
  placedOrder: Order | null = null;

  shipping = { fullName: '', email: '', phone: '', address: '', city: '', zip: '' };
  payment = { name: '', card: '', expiry: '', cvv: '' };

  private readonly FREE_SHIP_THRESHOLD = 50;
  private readonly SHIP_FEE = 4.99;
  private readonly TAX_RATE = 0.08;
  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toast: ToastService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.getUiCart().subscribe(items => (this.items = items));

    // Prefill the shipping form from the saved profile/address.
    const p = this.profileService.profile;
    this.shipping.fullName = p.name || '';
    this.shipping.phone = p.phone || '';
    this.shipping.address = p.address || '';
    this.shipping.city = p.location || '';
    this.shipping.zip = p.pincode || '';
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  get subtotal(): number { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); }
  get shippingFee(): number { return this.subtotal >= this.FREE_SHIP_THRESHOLD ? 0 : this.SHIP_FEE; }
  get tax(): number { return this.subtotal * this.TAX_RATE; }
  get total(): number { return this.subtotal + this.shippingFee + this.tax; }
  get itemCount(): number { return this.items.reduce((s, i) => s + i.quantity, 0); }

  get shippingValid(): boolean {
    const s = this.shipping;
    return !!(s.fullName && s.email.includes('@') && s.phone && s.address && s.city && s.zip);
  }
  get paymentValid(): boolean {
    const p = this.payment;
    return !!(p.name && p.card.replace(/\s/g, '').length >= 12 && p.expiry && p.cvv.length >= 3);
  }

  next(): void {
    if (this.step === 1 && !this.shippingValid) { this.warn(); return; }
    if (this.step === 2 && !this.paymentValid) { this.warn(); return; }
    this.step++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  back(): void { if (this.step > 1) this.step--; }

  private warn(): void {
    this.toast.show('Please complete all required fields', 'error', 'fa-solid fa-circle-exclamation');
  }

  placeOrder(): void {
    if (!this.items.length) return;
    this.placing = true;
    // Persist to FakeStore too (kept from original behaviour), but don't block on it.
    this.cartService.syncUiCartToApi().subscribe({ next: () => {}, error: () => {} });

    setTimeout(() => {
      this.placedOrder = this.orderService.place({
        total: this.total,
        items: this.items.map(i => ({ title: i.title, qty: i.quantity, price: i.price, image: i.image })),
        address: `${this.shipping.address}, ${this.shipping.city} ${this.shipping.zip}`,
      });
      this.cartService.clearUiCart();
      this.placing = false;
      this.toast.show('Order placed successfully!', 'success', 'fa-solid fa-circle-check');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  }

  maskCard(card: string): string {
    const digits = card.replace(/\s/g, '');
    return digits ? '•••• •••• •••• ' + digits.slice(-4) : '';
  }
}
