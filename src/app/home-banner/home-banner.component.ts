import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {

  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    });
  }
}
