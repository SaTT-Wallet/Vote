import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      // },
      // {
      //   path: 'vote',
      //   loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      // },
      // {
      //   path: 'vote',
      //   loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      // },

      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
      },
    ]
  },
  // {
  //   path: 'vote',
  //   loadChildren: () => import('../vote/vote.module').then((m) => m.VoteModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
