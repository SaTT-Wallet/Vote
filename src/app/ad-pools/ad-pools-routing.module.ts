import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdPoolsComponent } from './components/ad-pools/ad-pools.component';
import { HeaderComponent } from '../layout/components/header/header.component';

const routes: Routes = [
  {path: '', component: AdPoolsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdPoolsRoutingModule { }
