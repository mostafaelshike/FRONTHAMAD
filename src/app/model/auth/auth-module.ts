import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Login } from './component/login/login';
import { Register } from './component/register/register';

@NgModule({
  declarations: [Login, Register],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [Login, Register]
})
export class AuthModule {}