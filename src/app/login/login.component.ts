import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  token = '';

  constructor(private authService: AuthService) {}

  login() {
    const credentials = { username: this.username, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.token = res.token;
        this.authService.saveToken(res.token);
        this.errorMessage = '';
        console.log('Login successful. Token:', res.token);
        alert('Login successful!');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.token = '';
    this.username = '';
    this.password = '';
    alert('Logged out successfully!');
  }
}
