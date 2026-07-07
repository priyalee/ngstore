import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  showPassword = false;
  loading = false;
  private returnUrl = '/front-banner';

  perks = [
    'Faster checkout & saved addresses',
    'Track orders and easy returns',
    'Members-only deals and early access',
  ];

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/front-banner';
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.enter(`Welcome back, ${this.username}!`),
      // Fallback so the demo never blocks if the auth API is unavailable.
      error: () => {
        this.authService.loginLocal(this.username);
        this.enter(`Welcome back, ${this.username}!`);
      }
    });
  }

  guest() {
    this.authService.continueAsGuest();
    this.enter('Browsing as guest');
  }

  private enter(message: string) {
    this.loading = false;
    this.toast.show(message, 'success', 'fa-solid fa-circle-check');
    this.router.navigateByUrl(this.returnUrl);
  }

  fillDemo() {
    this.username = 'mor_2314';
    this.password = '83r5^_';
  }
}
