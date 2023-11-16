import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdPoolsRoutingModule } from './ad-pools-routing.module';
import { AdPoolsComponent } from './components/ad-pools/ad-pools.component';
import { LayoutModule } from '../layout/layout.module';
import { AdPoolsDashboardComponent } from './components/ad-pools-dashboard/ad-pools-dashboard.component';


@NgModule({
  declarations: [
    AdPoolsComponent,
    AdPoolsDashboardComponent
  ],
  imports: [
    CommonModule,
    AdPoolsRoutingModule,
    LayoutModule
  ]
})
export class AdPoolsModule { }
