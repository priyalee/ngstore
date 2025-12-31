// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './user/user.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { AboutComponent } from './essentials/about/about.component';
import { ContactComponent } from './essentials/contact/contact.component';
import { ShopComponent } from './essentials/shop/shop.component';
import { FrontBannerComponent } from './essentials/front-banner/front-banner.component';
import { OrderComponent } from './essentials/order/order.component';

export const routes: Routes = [
  { path: '', redirectTo: 'front-banner', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'user', component:UsersComponent},
  { path: 'home-banner', component: HomeBannerComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'front-banner', component: FrontBannerComponent },
  { path: 'order', component: OrderComponent }
];
