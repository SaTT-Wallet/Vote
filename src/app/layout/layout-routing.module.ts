import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [

      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      },
      { path: 'social-networks', component: SocialNetworksComponent },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
