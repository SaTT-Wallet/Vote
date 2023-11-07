import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProposalListComponent } from './components/proposal-list/proposal-list.component';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  constructor(private router: Router) { }

  makeProposalPage() {
    this.router.navigate(['/proposal/create']);
  }
}
