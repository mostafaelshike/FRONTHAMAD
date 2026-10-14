import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatogreyRoutingModule } from './catogrey-routing-module';
import { Catogrey } from './component/catogrey/catogrey';


@NgModule({
  declarations: [
    Catogrey
  ],
  imports: [
    CommonModule,
   CatogreyRoutingModule
  ]
})
export class CatogreyModule { }
