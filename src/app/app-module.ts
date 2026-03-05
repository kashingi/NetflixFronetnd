import { inject, NgModule, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Landing } from './landing/landing';
import { SharedModule } from './Shared/shared-module';
import { Signup } from './signup/signup';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';
import { Home } from './user/home/home';
import { authInterceptor } from './Shared/interceptors/auth-interceptor';
import { ForgetPassword } from './forget-password/forget-password';
import { Auth } from './Shared/services/auth';
import { ResetPassword } from './reset-password/reset-password';

@NgModule({
  declarations: [
    App,
    Landing,
    Signup,
    Login,
    VerifyEmail,
    Home,
    ForgetPassword,
    ResetPassword
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideAppInitializer(() => {
      const auth = inject(Auth);
      return auth.initializeAuth();
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }
