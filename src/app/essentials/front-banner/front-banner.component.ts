import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-front-banner',
  imports: [RouterOutlet,NavbarComponent,NgIf,CommonModule],
  standalone: true,
  templateUrl: './front-banner.component.html',
  styleUrl: './front-banner.component.scss'
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

    // Subscribe to prompt visibility
    this.notificationService.showPrompt$.subscribe(show => {
      this.showNotificationPrompt = show;
    });

    // Trigger on landing page
    this.notificationService.showPrompt();
  }

  allowNotifications(): void {
    this.notificationService.allowNotifications();
  }

  blockNotifications(): void {
    this.notificationService.blockNotifications();
  }
}
