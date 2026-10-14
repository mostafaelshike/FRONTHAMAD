import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthLayout } from './auth-layout';

@NgModule({
  declarations: [AuthLayout],
  imports: [RouterModule],
  exports: [AuthLayout]
})
export class AuthLayoutModule {}