// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './user/user.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'user', component:UsersComponent},
  { path: 'home-banner', component: HomeBannerComponent }
];
