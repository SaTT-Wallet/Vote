import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';
import { TransfomNumberPipe } from '../shared/pipes/transfom-number.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterBarComponent,
    SocialNetworksComponent,
    TransfomNumberPipe,
  ],
  imports: [
    LayoutRoutingModule,
    HttpClientModule,
    CommonModule,
    TranslateModule.forRoot(),
    MatSnackBarModule,
  ],

  providers: [],
})
export class LayoutModule {}
