import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'ngstore-theme';
  private darkModeSubject = new BehaviorSubject<boolean>(this.readInitial());
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.apply(this.darkModeSubject.value);
  }

  private readInitial(): boolean {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  }

  /** Apply the theme to <html> so both our tokens and Bootstrap respond. */
  private apply(isDark: boolean): void {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    try { localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light'); } catch {}
  }

  setDarkMode(isDark: boolean): void {
    this.apply(isDark);
    this.darkModeSubject.next(isDark);
  }

  toggle(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  get isDark(): boolean {
    return this.darkModeSubject.value;
  }
}
