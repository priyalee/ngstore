import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  // Whether error page should show
  showError$ = new BehaviorSubject<boolean>(false);

  // Optional: pass a message to display on the page
  errorMessage$ = new BehaviorSubject<string>('An unexpected error occurred.');

  showError(message?: string) {
    if (message) this.errorMessage$.next(message);
    this.showError$.next(true);
  }

  hideError() {
    this.showError$.next(false);
    this.errorMessage$.next('An unexpected error occurred.');
  }
}
