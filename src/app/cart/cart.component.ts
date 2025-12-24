// src/app/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  carts: any[] = [];
  selectedCart: any = null;
  isLoading = false;
  isUpdating = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCarts();
  }

  /* ================= LOAD CARTS ================= */

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

  /* ================= VIEW CART ================= */

  viewCart(id: number): void {
    this.cartService.getById(id).subscribe(cart => {
      this.selectedCart = cart;
    });
  }

  /* ================= DELETE CART ================= */

  deleteCart(id: number): void {
    this.cartService.delete(id).subscribe(() => {
      this.loadCarts();
      if (this.selectedCart?.id === id) {
        this.selectedCart = null;
      }
    });
  }

  /* ================= QUANTITY ================= */

  increase(p: any): void {
    p.quantity++;
    this.updateBackendCart();
  }

  decrease(p: any): void {
    if (p.quantity > 1) {
      p.quantity--;
      this.updateBackendCart();
    }
  }

  /* ================= SYNC ================= */

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
