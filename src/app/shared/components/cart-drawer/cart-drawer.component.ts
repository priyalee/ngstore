import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CartService, CartItem } from '@core/services/cart.service';
import { CartUiService } from '@core/services/cart-ui.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss']
})
export class CartDrawerComponent implements OnInit, OnDestroy {
  open = false;
  items: CartItem[] = [];
  subtotal = 0;
  private subs: Subscription[] = [];

  constructor(
    private cartUi: CartUiService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(this.cartUi.isOpen$.subscribe(o => (this.open = o)));
    this.subs.push(this.cartService.getUiCart().subscribe(i => (this.items = i)));
    this.subs.push(this.cartService.subtotal$.subscribe(s => (this.subtotal = s)));
    this.subs.push(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.cartUi.close())
    );
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  close(): void { this.cartUi.close(); }
  inc(i: CartItem): void { this.cartService.increment(i.id); }
  dec(i: CartItem): void { this.cartService.decrement(i.id); }
  remove(i: CartItem): void { this.cartService.removeFromUiCart(i.id); }
  trackById(_: number, i: CartItem) { return i.id; }
}
