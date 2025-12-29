import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ThemeService } from '../services/theme.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {

  isDarkMode: boolean = false;
  showNotificationPrompt: boolean = false;

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Dark mode subscription
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Notification subscription
    this.notificationService.showPrompt$.subscribe(show => {
      this.showNotificationPrompt = show;
    });

    // Trigger alert whenever this component loads
    this.notificationService.showPrompt();
  }

  allowNotifications(): void {
    this.notificationService.allowNotifications();
  }

  blockNotifications(): void {
    this.notificationService.blockNotifications();
  }
}
