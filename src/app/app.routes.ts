import { Routes } from '@angular/router';
import { FrontBannerComponent } from './essentials/front-banner/front-banner.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './essentials/shop/shop.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './essentials/order/order.component';
import { AboutComponent } from './essentials/about/about.component';
import { ContactComponent } from './essentials/contact/contact.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './user/user.component';

export const routes: Routes = [

  { path: '', redirectTo: 'front-banner', pathMatch: 'full' },
  { path: 'front-banner', component: FrontBannerComponent },
  { path: 'home-banner', component: HomeBannerComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'user', component: UsersComponent },
  { path: '**', redirectTo: 'front-banner' }

];
