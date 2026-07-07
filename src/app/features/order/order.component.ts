import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService, Order } from '@core/services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  filter: 'all' | 'delivered' | 'shipped' | 'processing' = 'all';
  orders: Order[] = [];
  steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
  private sub?: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.sub = this.orderService.getAll().subscribe(o => (this.orders = o));
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  get filtered(): Order[] {
    return this.filter === 'all' ? this.orders : this.orders.filter(o => o.status === this.filter);
  }

  stepIndex(status: string): number {
    return { processing: 1, shipped: 2, delivered: 3 }[status] ?? 0;
  }

  statusLabel(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
