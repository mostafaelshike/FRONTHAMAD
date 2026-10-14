import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';

import {
  BrowserModule,
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { NavbarModule } from './model/navbar/navbar-module';
import { FooterModule } from './model/footer/footer-module';
import { MainLayoutModule } from './core/layout/main-layout/main-layout-module';
import { AuthLayoutModule } from './core/layout/auth-layout/auth-layout-module';
import { AuthModule } from './model/auth/auth-module';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [
    App
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarModule,
    FooterModule,
    MainLayoutModule,
    AuthLayoutModule,
    AuthModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, errorInterceptor]))
  ],

  bootstrap: [App]
})
export class AppModule {}