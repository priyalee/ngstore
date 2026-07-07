import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { ProfileService, Profile } from '@core/services/profile.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  singleUser: any;
  showAdmin = false;

  /** Editable profile: name, contact & full delivery address. */
  form: Profile = { name: '', location: 'Bangalore', pincode: '', phone: '', address: '', state: '' };
  cities = ['Bangalore', 'Gurugram', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
  states = ['Karnataka', 'Delhi', 'Maharashtra', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];

  quickLinks = [
    { icon: 'fa-box', title: 'My Orders', desc: 'Track & return items', link: '/order' },
    { icon: 'fa-cart-shopping', title: 'My Cart', desc: 'Review your items', link: '/cart' },
    { icon: 'fa-heart', title: 'Wishlist', desc: 'Saved for later', link: '/wishlist' },
    { icon: 'fa-map-location-dot', title: 'Deals', desc: 'Todays best offers', link: '/home-banner' },
  ];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = { ...this.profileService.profile };
    if (!this.form.name && this.authService.state.username) {
      this.form.name = this.authService.state.username;
    }
    this.loadUsers();
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
    const parts = this.displayName.trim().split(' ');
    return ((parts[0]?.[0] ?? 'G') + (parts[1]?.[0] ?? '')).toUpperCase();
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

  loadUsers() {
    this.userService.getAll().subscribe((data) => (this.users = data));
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe((user) => (this.singleUser = user));
  }

  addUser() {
    const newUser = {
      email: 'demo@example.com',
      username: 'demoUser',
      password: 'demo123',
      name: { firstname: 'Demo', lastname: 'User' },
      address: { city: 'Delhi', street: 'Main Street', number: 42, zipcode: '12345', geolocation: { lat: '20.000', long: '10.000' } },
      phone: '9876543210',
    };
    this.userService.add(newUser).subscribe(() => this.loadUsers());
  }

  updateUser(id: number) {
    this.userService.update(id, { username: 'updatedUser', email: 'updated@example.com' })
      .subscribe(() => this.loadUsers());
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe(() => this.loadUsers());
  }
}
