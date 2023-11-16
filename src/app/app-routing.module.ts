import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./vote/vote.module').then((m) => m.VoteModule)
  // },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule)
    //canActivateChild:
  },
  {
    path: 'ad-pools',
    loadChildren: () =>
     import('./ad-pools/ad-pools.module').then((m) => m.AdPoolsModule)
    //canActivateChild:
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    enableTracing: false, // set it true only in dev mode
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
