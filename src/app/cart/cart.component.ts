import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: any[] = [];
  selectedCart: any = null;
  isLoading = false;

  constructor(private cartService: CartService) {

  }

  ngOnInit() {
    this.loadCarts();
  }

  //  Load all carts
  loadCarts() {
    this.isLoading = true;
    this.cartService.getAll().subscribe({
      next: (data) => {
        this.carts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading carts:', err);
        this.isLoading = false;
      }
    });
  }

  //  View single cart
  viewCart(id: number) {
    this.cartService.getById(id).subscribe(res => {
      this.selectedCart = res;
    });
  }

  // ➕ Add a new cart
  addCart() {
    const newCart = {
      userId: 5,
      date: new Date().toISOString().split('T')[0],
      products: [
        { productId: 1, quantity: 3 },
        { productId: 2, quantity: 2 }
      ]
    };
    this.cartService.add(newCart).subscribe(res => {
      console.log('Cart added:', res);
      this.loadCarts();
    });
  }

  //  Update cart
  updateCart(id: number) {
    const updatedCart = {
      userId: 5,
      date: new Date().toISOString().split('T')[0],
      products: [{ productId: 1, quantity: 1 }]
    };
    this.cartService.update(id, updatedCart).subscribe(res => {
      console.log('Cart updated:', res);
      this.loadCarts();
    });
  }

  //  Delete cart
  deleteCart(id: number) {
    this.cartService.delete(id).subscribe(res => {
      console.log('Cart deleted:', res);
      this.loadCarts();
    });
  }
}
