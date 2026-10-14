import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterRoutingModule } from './footer-routing-module';
import { Footer } from './component/footer/footer';

@NgModule({
  declarations: [
    Footer
  ],

  imports: [
    CommonModule,
    FooterRoutingModule
  ],

  exports: [
    Footer
  ]
})
export class FooterModule {}