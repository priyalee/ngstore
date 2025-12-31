import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { NavbarComponent } from "../navbar/navbar.component";

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  carts: any[] = [];
  selectedCart: any = null;
  isLoading = false;
  isUpdating = false;

  constructor(
    private cartService: CartService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.applyLightMode();  
    this.loadCarts();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'light-mode');
    this.renderer.removeClass(document.body, 'dark-mode');
  }

  /*THEME */
  private applyLightMode(): void {
    this.renderer.removeClass(document.body, 'dark-mode');
    this.renderer.addClass(document.body, 'light-mode');
  }

  /* LOAD CARTS */
  loadCarts(): void {
    this.isLoading = true;
    this.cartService.getAll().subscribe({
      next: carts => {
        this.carts = carts;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  /* VIEW CART MODAL */
  viewCart(cart: any): void {
    this.selectedCart = cart;

    const modalEl = document.getElementById('cartModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  /* DELETE CART */
  deleteCart(id: number): void {
    this.cartService.delete(id).subscribe(() => {
      this.loadCarts();

      if (this.selectedCart?.id === id) {
        this.selectedCart = null;
      }
    });
  }

  /* QUANTITY */
  increase(product: any): void {
    product.quantity++;
    this.updateBackendCart();
  }

  decrease(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
      this.updateBackendCart();
    }
  }

  /* SYNC CART */
  private updateBackendCart(): void {
    if (!this.selectedCart) return;

    this.isUpdating = true;

    const payload = {
      userId: this.selectedCart.userId,
      date: this.selectedCart.date,
      products: this.selectedCart.products
    };

    this.cartService.update(this.selectedCart.id, payload).subscribe({
      next: () => this.isUpdating = false,
      error: () => this.isUpdating = false
    });
  }
}
