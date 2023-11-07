import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterBarComponent
  ],
  imports: [
     LayoutRoutingModule, HttpClientModule, CommonModule],

  providers: [
  ]
})
export class LayoutModule {}
