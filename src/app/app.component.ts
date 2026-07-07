import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { filter, combineLatest } from 'rxjs';
import { NavbarComponent } from "@layout/navbar/navbar.component";
import { FooterComponent } from '@layout/footer/footer.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { CartDrawerComponent } from '@shared/components/cart-drawer/cart-drawer.component';
import { ErrorPageComponent } from '@features/error/error.component';
import { ConnectionService } from '@core/services/connection.service';
import { ErrorService } from '@core/services/error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, CartDrawerComponent, ErrorPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngstore';
  /** The sign-in gate renders full-screen, without the app chrome. */
  isAuthRoute = false;
  /** Global error overlay: 'offline' (no internet) or 'server' (5xx). */
  errorOverlay: 'offline' | 'server' | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private connection: ConnectionService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.isAuthRoute = this.router.url.split('?')[0].startsWith('/signin');

      let r = this.route;
      while (r.firstChild) r = r.firstChild;
      this.titleService.setTitle(r.snapshot.data['title'] || 'NgStore');
    });

    // Offline takes priority over a server error.
    combineLatest([this.connection.online$, this.errorService.showError$]).subscribe(([online, hasError]) => {
      this.errorOverlay = !online ? 'offline' : hasError ? 'server' : null;
    });
  }
}
