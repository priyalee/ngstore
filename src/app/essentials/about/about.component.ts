import { ThemeService } from './../../services/theme.service';
import { CommonModule } from '@angular/common';
import { Component,OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

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
