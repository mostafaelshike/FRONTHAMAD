import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { Login } from './model/auth/component/login/login';
import { Register } from './model/auth/component/register/register';
import { authGuard, guestGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [{ path: '', component: Login }]
  },
  {
    path: 'register',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [{ path: '', component: Register }]
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./model/home/home-module').then(m => m.HomeModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./model/product/product-module').then(m => m.ProductModule),
      },
      {
        path: 'catogrey',
        loadChildren: () => import('./model/catogrey/catogrey-module').then(m => m.CatogreyModule)
      },
      {
        path: 'favorit',
        loadChildren: () => import('./model/favorite/favorite-module').then(m => m.FavoriteModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./model/cart/cart-module').then(m => m.CartModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./model/about-us/about-us-module').then(m => m.AboutUsModule)
      },
      {
        path: 'conect',
        loadChildren: () => import('./model/conect/conect-module').then(m => m.ConectModule)
      },
      {
        path:'profile',
        canActivate: [authGuard],
        loadChildren:() => import('./model/profile/profile-module').then(m => m.ProfileModule) 
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
