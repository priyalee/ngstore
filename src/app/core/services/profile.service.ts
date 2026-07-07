import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Profile {
  name: string;
  location: string;   // city (kept name for navbar compatibility)
  pincode: string;
  phone: string;
  address: string;    // house no. / street / area
  state: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly storageKey = 'ngstore-profile';
  private subject = new BehaviorSubject<Profile>(this.read());
  profile$ = this.subject.asObservable();

  private read(): Profile {
    const fallback: Profile = { name: '', location: 'Bangalore', pincode: '', phone: '', address: '', state: '' };
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return { ...fallback, ...JSON.parse(raw) };
    } catch {}
    return fallback;
  }

  private write(p: Profile): void {
    this.subject.next(p);
    try { localStorage.setItem(this.storageKey, JSON.stringify(p)); } catch {}
  }

  get profile(): Profile { return this.subject.value; }

  setProfile(patch: Partial<Profile>): void {
    this.write({ ...this.subject.value, ...patch });
  }

  setLocation(location: string): void {
    this.setProfile({ location });
  }
}
