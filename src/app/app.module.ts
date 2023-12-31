import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacebookModule } from 'ngx-facebook';

import { translateBrowserLoaderFactory } from './core/loaders/translate-browser.loader';


import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environments/environment.prod';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpInterceptorService } from './http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'satt-token-atayen' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TransferHttpCacheModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    }),
    FacebookModule.forRoot(),
    CoreModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    })
    /*   GoogleTagManagerModule.forRoot({
      id: environment.gmtId
    })*/
  ],
  exports:[TranslateModule], 
  providers: [{ provide: 'isBrowser', useValue: true }, {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
