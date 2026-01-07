import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ErrorService } from './../../services/error.service';
import { ThemeService } from './../../services/theme.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorPageComponent implements OnInit {
  message = '';
  isDarkMode = false;

  constructor(
    public errorService: ErrorService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Error message
    this.errorService.errorMessage$.subscribe(msg => {
      this.message = msg;
    });

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      document.body.classList.toggle('dark-mode', isDark);
    });
  }

  goHome(): void {
    this.errorService.hideError();
    this.router.navigate(['/front-banner']);
  }
}
