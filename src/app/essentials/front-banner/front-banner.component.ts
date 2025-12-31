import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-front-banner',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './front-banner.component.html',
  styleUrls: ['./front-banner.component.scss']
})
export class FrontBannerComponent implements OnInit {

  isDarkMode = false;
  showNotificationPrompt = false;

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    // Dark mode
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      document.body.classList.toggle('dark-mode', isDark);
    });

    // Listen to notification state
    this.notificationService.showPrompt$.subscribe(show => {
      this.showNotificationPrompt = show;
    });

    // TRIGGER ON LANDING
    this.notificationService.showPrompt();
  }

  allowNotifications(): void {
    this.notificationService.allowNotifications();
  }

  blockNotifications(): void {
    this.notificationService.blockNotifications();
  }
}
