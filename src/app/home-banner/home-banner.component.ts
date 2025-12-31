import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {

  isDarkMode: boolean = false;
  showNotificationPrompt: boolean = false;

  constructor(
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    // Dark mode subscription
    this.themeService.darkMode$.subscribe(isDark => {
  this.isDarkMode = isDark;
  document.body.classList.toggle('dark-mode', isDark);
});
  }
}