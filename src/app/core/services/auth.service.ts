import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthState {
  loggedIn: boolean;   // signed in with an account
  guest: boolean;      // chose to browse as a guest
  username: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'https://fakestoreapi.com/auth/login';
  private readonly sessionKey = 'ngstore-session';

  private stateSubject = new BehaviorSubject<AuthState>(this.read());
  authState$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {}

  private read(): AuthState {
    try {
      const raw = localStorage.getItem(this.sessionKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { loggedIn: false, guest: false, username: null };
  }

  private write(state: AuthState): void {
    this.stateSubject.next(state);
    try { localStorage.setItem(this.sessionKey, JSON.stringify(state)); } catch {}
  }

  get state(): AuthState { return this.stateSubject.value; }

  /** Has the user passed the entry gate (signed in OR chose guest)? */
  hasEntered(): boolean {
    const s = this.state;
    return s.loggedIn || s.guest;
  }

  isLoggedIn(): boolean { return this.state.loggedIn; }

  /** Real login against FakeStore; persists a token when the API returns one. */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.api, credentials).pipe(
      tap(res => {
        if (res?.token) this.saveToken(res.token);
        this.write({ loggedIn: true, guest: false, username: credentials.username });
      })
    );
  }

  /** Fallback so the demo never blocks if the auth API is unavailable. */
  loginLocal(username: string): void {
    this.write({ loggedIn: true, guest: false, username });
  }

  continueAsGuest(): void {
    this.write({ loggedIn: false, guest: true, username: null });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.write({ loggedIn: false, guest: false, username: null });
  }

  saveToken(token: string) { localStorage.setItem('authToken', token); }
  getToken(): string | null { return localStorage.getItem('authToken'); }
}
