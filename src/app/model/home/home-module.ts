import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './component/home/home';
import { ProductDetailsModal } from '../../shared/product-details-modal/product-details-modal';


@NgModule({
  declarations: [
    Home
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductDetailsModal
  ]
})
export class HomeModule { }
