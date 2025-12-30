import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false); // initial mode: light
  darkMode$ = this.darkModeSubject.asObservable();

  // Add this method to update dark mode
  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
  }
}
