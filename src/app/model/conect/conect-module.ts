import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConectRoutingModule } from './conect-routing-module';
import { Conect } from './component/conect/conect';


@NgModule({
  declarations: [
    Conect
  ],
  imports: [
    CommonModule,
    ConectRoutingModule
  ]
})
export class ConectModule { }
