import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarRoutingModule } from './navbar-routing-module';
import { Navbar } from './component/navbar/navbar';

@NgModule({
  declarations: [
    Navbar
  ],

  imports: [
    CommonModule,
    FormsModule,
    NavbarRoutingModule
  ],

  exports: [
    Navbar
  ]
})
export class NavbarModule {}