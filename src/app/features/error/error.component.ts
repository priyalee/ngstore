import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConnectionService } from '@core/services/connection.service';
import { ErrorService } from '@core/services/error.service';

type Variant = 'not-found' | 'offline' | 'server' | 'generic';

interface ErrorConfig {
  code: string;
  icon: string;
  title: string;
  message: string;
  retry: boolean;
}

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorPageComponent {
  /** Bound from route data (via withComponentInputBinding) or set directly for the overlay. */
  @Input() variant: Variant = 'not-found';
  /** When true, renders as a full-screen overlay above the app chrome. */
  @Input() overlay = false;

  private readonly configs: Record<Variant, ErrorConfig> = {
    'not-found': {
      code: '404', icon: 'fa-compass', title: 'Page not found',
      message: "The page you're looking for doesn't exist, was moved, or the link is broken.",
      retry: false,
    },
    'offline': {
      code: 'Offline', icon: 'fa-wifi', title: "You're offline",
      message: 'We can’t reach the internet right now. Check your connection and try again.',
      retry: true,
    },
    'server': {
      code: '500', icon: 'fa-server', title: 'Something went wrong',
      message: 'Our servers hit a snag while loading this page. Please try again in a moment.',
      retry: true,
    },
    'generic': {
      code: 'Oops', icon: 'fa-triangle-exclamation', title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      retry: true,
    },
  };

  constructor(
    private router: Router,
    private connection: ConnectionService,
    private errorService: ErrorService
  ) {}

  get cfg(): ErrorConfig {
    return this.configs[this.variant] ?? this.configs['generic'];
  }

  retry(): void {
    if (this.variant === 'offline') {
      // Reload for fresh data if we're back online; otherwise just re-check.
      if (this.connection.recheck()) window.location.reload();
      return;
    }
    // server / generic: clear the error state and reload
    this.errorService.hideError();
    window.location.reload();
  }

  goHome(): void {
    this.errorService.hideError();
    this.router.navigate(['/front-banner']);
  }

  goBack(): void {
    this.errorService.hideError();
    history.length > 1 ? history.back() : this.router.navigate(['/front-banner']);
  }
}
