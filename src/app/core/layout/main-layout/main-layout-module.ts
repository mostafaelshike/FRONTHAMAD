import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../../../model/footer/footer-module';
import { NavbarModule } from '../../../model/navbar/navbar-module';
import { MainLayout } from './main-layout';

@NgModule({
  declarations: [MainLayout],
  imports: [RouterModule, NavbarModule, FooterModule],
  exports: [MainLayout]
})
export class MainLayoutModule {}