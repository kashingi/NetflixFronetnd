import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Landing } from './landing/landing';
import { SharedModule } from './Shared/shared-module';
import { Signup } from './signup/signup';
import { provideHttpClient } from '@angular/common/http';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';

@NgModule({
  declarations: [
    App,
    Landing,
    Signup,
    Login,
    VerifyEmail
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
