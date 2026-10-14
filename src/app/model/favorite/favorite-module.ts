import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteRoutingModule } from './favorite-routing-module';
import { Favorite } from './component/favorite/favorite';
import { ProductDetailsModal } from '../../shared/product-details-modal/product-details-modal';


@NgModule({
  declarations: [
    Favorite
  ],
  imports: [
    CommonModule,
    ProductDetailsModal,
    FavoriteRoutingModule
  ]
})
export class FavoriteModule { }
