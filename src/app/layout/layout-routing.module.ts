import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { PasswordModalComponent } from '../campaigns/components/password-modal/password-modal.component';
import { LayoutComponent } from './layout.component';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';

// import { FarmPostsComponent } from "@app/components/farm-posts/farm-posts.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../campaigns/campaigns.module').then((m) => m.CampaignsModule)
      },

      {
        path: 'check-password',
        component: PasswordModalComponent,
        canActivate: [AuthGuardService]
      },

      { path: 'home', redirectTo: 'ad-pools', pathMatch: 'full' },
      /*{
        path: 'vote',
        loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      },*/
      { path: 'social-networks', pathMatch: 'full',component: SocialNetworksComponent },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
