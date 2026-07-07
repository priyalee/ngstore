import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your components
import { FrontBannerComponent } from '@features/front-banner/front-banner.component';
import { HomeBannerComponent } from '@features/home-banner/home-banner.component';
import { HomeComponent } from '@features/home/home.component';
import { ShopComponent } from '@features/shop/shop.component';
import { CartComponent } from '@features/cart/cart.component';
import { OrderComponent } from '@features/order/order.component';
import { AboutComponent } from '@features/about/about.component';
import { ContactComponent } from '@features/contact/contact.component';
import { LoginComponent } from '@features/login/login.component';
import { UsersComponent } from '@features/user/user.component';
import { ErrorPageComponent } from '@features/error/error.component';
import { ProductDetailComponent } from '@features/product-detail/product-detail.component';
import { WishlistComponent } from '@features/wishlist/wishlist.component';
import { CheckoutComponent } from '@features/checkout/checkout.component';
import { authGuard } from '@core/guards/auth.guard';

// Define routes
export const routes: Routes = [
  // Default route redirects to front-banner
  { path: '', redirectTo: 'front-banner', pathMatch: 'full' },

  // Sign-in gate (always accessible)
  { path: 'signin', component: LoginComponent, data: { title: 'Sign In — NgStore' } },

  // Main app routes — gated behind sign-in / guest entry
  { path: 'front-banner', component: FrontBannerComponent, canActivate: [authGuard], data: { title: 'NgStore — Everything you love, delivered' } },
  { path: 'home-banner', component: HomeBannerComponent, canActivate: [authGuard], data: { title: "Today's Deals — NgStore" } },
  { path: 'home', component: HomeComponent, canActivate: [authGuard], data: { title: 'All Products — NgStore' } },
  { path: 'shop', component: ShopComponent, canActivate: [authGuard], data: { title: 'Shop — NgStore' } },
  { path: 'product/:id', component: ProductDetailComponent, canActivate: [authGuard], data: { title: 'Product — NgStore' } },
  { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard], data: { title: 'My Wishlist — NgStore' } },
  { path: 'cart', component: CartComponent, canActivate: [authGuard], data: { title: 'Your Cart — NgStore' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], data: { title: 'Checkout — NgStore' } },
  { path: 'order', component: OrderComponent, canActivate: [authGuard], data: { title: 'Orders & Returns — NgStore' } },
  { path: 'about', component: AboutComponent, canActivate: [authGuard], data: { title: 'About Us — NgStore' } },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard], data: { title: 'Contact — NgStore' } },
  { path: 'user', component: UsersComponent, canActivate: [authGuard], data: { title: 'My Account — NgStore' } },

  // Wildcard route for unknown URLs (404)
  {
    path: '**',
    component: ErrorPageComponent,
    data: { variant: 'not-found', title: '404 — Page not found — NgStore' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
