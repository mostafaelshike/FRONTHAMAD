import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsProduct } from './component/details-product/details-product';
const routes: Routes = [
  {
    path:'',
    component:DetailsProduct
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsProductRoutingModule { }
