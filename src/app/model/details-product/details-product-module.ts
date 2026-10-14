import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsProductRoutingModule } from './details-product-routing-module';
import { DetailsProduct } from './component/details-product/details-product';


@NgModule({
  declarations: [
    DetailsProduct
  ],
  imports: [
    CommonModule,
    DetailsProductRoutingModule
  ]
})
export class DetailsProductModule { }
