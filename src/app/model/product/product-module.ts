import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductRoutingModule } from './product-routing-module';
import { ProductComponent } from './component/product/product';
import { ProductDetailsModal } from '../../shared/product-details-modal/product-details-modal';

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductDetailsModal,
    ProductRoutingModule
  ]
})
export class ProductModule { }
