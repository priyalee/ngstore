import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-shop',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to dark mode changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;

      // Add/remove dark-mode class on body dynamically
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }
}
