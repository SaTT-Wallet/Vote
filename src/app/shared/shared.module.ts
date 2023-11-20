import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { TransfomNumberPipe } from '@shared/pipes/transfom-number.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    TransfomNumberPipe,
   
  ],
  exports: [

    TransfomNumberPipe,
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [ConvertFromWei]
})
export class SharedModule {}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
