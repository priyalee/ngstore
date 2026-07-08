import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { ProfileService, Profile } from '@core/services/profile.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { OrderService } from '@core/services/order.service';

type QuickLinkType = 'orders' | 'cart' | 'wishlist' | 'deals';

interface QuickLink {
  icon: string;
  title: string;
  desc: string;
  link: string;
  type: QuickLinkType;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  singleUser: any;
  showAdmin = false;

  /** Admin table state. */
  usersLoading = false;
  usersError = false;
  viewingId: number | null = null; // row whose details are being fetched
  busyId: number | null = null;    // row performing an update/delete
  adding = false;                  // "add user" in flight
  pendingDelete: any = null;       // user awaiting delete confirmation

  /** Live counts for the quick-link badges. */
  cartCount = 0;
  cartSubtotal = 0;
  wishCount = 0;
  orderCount = 0;

  /** Editable profile: name, contact & full delivery address. */
  form: Profile = { name: '', location: 'Bangalore', pincode: '', phone: '', address: '', state: '' };
  cities = ['Bangalore', 'Gurugram', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
  states = ['Karnataka', 'Delhi', 'Maharashtra', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];

  quickLinks: QuickLink[] = [
    { icon: 'fa-box', title: 'My Orders', desc: 'Track & return items', link: '/order', type: 'orders' },
    { icon: 'fa-cart-shopping', title: 'My Cart', desc: 'Review your items', link: '/cart', type: 'cart' },
    { icon: 'fa-heart', title: 'Wishlist', desc: 'Saved for later', link: '/wishlist', type: 'wishlist' },
    { icon: 'fa-map-location-dot', title: 'Deals', desc: "Today's best offers", link: '/home-banner', type: 'deals' },
  ];

  private subs = new Subscription();

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private authService: AuthService,
    private toast: ToastService,
    private cart: CartService,
    private wishlist: WishlistService,
    private orders: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = { ...this.profileService.profile };
    if (!this.form.name && this.authService.state.username) {
      this.form.name = this.authService.state.username;
    }

    // Keep the quick-link badges in sync with the rest of the app.
    this.subs.add(this.cart.count$.subscribe((c) => (this.cartCount = c)));
    this.subs.add(this.cart.subtotal$.subscribe((s) => (this.cartSubtotal = s)));
    this.subs.add(this.wishlist.count$.subscribe((c) => (this.wishCount = c)));
    this.subs.add(this.orders.getAll().subscribe((o) => (this.orderCount = o.length)));

    this.loadUsers();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get displayName(): string {
    return this.profileService.profile.name || this.authService.state.username || 'Guest';
  }

  get profile(): Profile {
    return this.profileService.profile;
  }

  get hasAddress(): boolean {
    const p = this.profileService.profile;
    return !!(p.address || p.phone);
  }

  get initials(): string {
    const parts = this.displayName.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? 'G') + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  /** Does a quick-link have a live value worth showing as a badge? */
  hasBadge(type: QuickLinkType): boolean {
    switch (type) {
      case 'orders': return this.orderCount > 0;
      case 'cart': return this.cartCount > 0;
      case 'wishlist': return this.wishCount > 0;
      default: return false;
    }
  }

  trackUser(_: number, u: any) {
    return u?.id;
  }

  saveProfile(): void {
    if (!this.form.name.trim()) {
      this.toast.show('Please enter your name', 'error', 'fa-solid fa-circle-exclamation');
      return;
    }
    if (this.form.phone && !/^[+\d][\d\s-]{7,}$/.test(this.form.phone.trim())) {
      this.toast.show('Please enter a valid phone number', 'error', 'fa-solid fa-circle-exclamation');
      return;
    }
    this.profileService.setProfile({
      name: this.form.name.trim(),
      phone: this.form.phone.trim(),
      address: this.form.address.trim(),
      location: this.form.location.trim() || 'Bangalore',
      state: this.form.state.trim(),
      pincode: this.form.pincode.trim(),
    });
    this.toast.show('Profile & address saved', 'success', 'fa-solid fa-circle-check');
  }

  /** Sign out for real: clear the session, then return to the sign-in gate. */
  signOut(): void {
    this.authService.logout();
    this.toast.show('You have been signed out', 'info', 'fa-solid fa-right-from-bracket');
    this.router.navigate(['/signin']);
  }

  /* ---------------- Admin: users management ---------------- */

  loadUsers() {
    this.usersLoading = true;
    this.usersError = false;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.usersLoading = false;
      },
      error: () => {
        this.usersError = true;
        this.usersLoading = false;
        this.toast.show('Could not load users', 'error', 'fa-solid fa-triangle-exclamation');
      },
    });
  }

  loadUser(id: number) {
    // Toggle off if the same user is tapped again.
    if (this.singleUser?.id === id) {
      this.singleUser = null;
      return;
    }
    this.viewingId = id;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.singleUser = user;
        this.viewingId = null;
      },
      error: () => {
        this.viewingId = null;
        this.toast.show('Could not load that user', 'error', 'fa-solid fa-triangle-exclamation');
      },
    });
  }

  addUser() {
    if (this.adding) return;
    this.adding = true;
    const newUser = {
      email: 'demo@example.com',
      username: 'demoUser',
      password: 'demo123',
      name: { firstname: 'Demo', lastname: 'User' },
      address: { city: 'Delhi', street: 'Main Street', number: 42, zipcode: '12345', geolocation: { lat: '20.000', long: '10.000' } },
      phone: '9876543210',
    };
    this.userService.add(newUser).subscribe({
      next: (res) => {
        // FakeStore doesn't persist, so reflect the new user locally.
        const id = res?.id ?? this.nextId();
        this.users = [{ id, username: newUser.username, email: newUser.email, phone: newUser.phone, name: newUser.name }, ...this.users];
        this.adding = false;
        this.toast.show('User added', 'success', 'fa-solid fa-user-plus');
      },
      error: () => {
        this.adding = false;
        this.toast.show('Could not add user', 'error', 'fa-solid fa-triangle-exclamation');
      },
    });
  }

  updateUser(id: number) {
    if (this.busyId != null) return;
    this.busyId = id;
    const patch = { username: 'updatedUser', email: 'updated@example.com' };
    this.userService.update(id, patch).subscribe({
      next: () => {
        this.users = this.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
        if (this.singleUser?.id === id) this.singleUser = { ...this.singleUser, ...patch };
        this.busyId = null;
        this.toast.show('User updated', 'success', 'fa-solid fa-circle-check');
      },
      error: () => {
        this.busyId = null;
        this.toast.show('Could not update user', 'error', 'fa-solid fa-triangle-exclamation');
      },
    });
  }

  /** Open the confirmation dialog before a destructive delete. */
  askDelete(user: any) {
    this.pendingDelete = user;
  }

  cancelDelete() {
    this.pendingDelete = null;
  }

  confirmDelete() {
    const user = this.pendingDelete;
    if (!user) return;
    const id = user.id;
    this.pendingDelete = null;
    this.busyId = id;
    this.userService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        if (this.singleUser?.id === id) this.singleUser = null;
        this.busyId = null;
        this.toast.show('User deleted', 'success', 'fa-solid fa-trash-can');
      },
      error: () => {
        this.busyId = null;
        this.toast.show('Could not delete user', 'error', 'fa-solid fa-triangle-exclamation');
      },
    });
  }

  private nextId(): number {
    return this.users.reduce((max, u) => Math.max(max, Number(u?.id) || 0), 0) + 1;
  }
}
