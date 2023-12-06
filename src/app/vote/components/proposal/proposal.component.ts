import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import { VoteListComponent } from './components/vote-list/vote-list.component';
import { CastVoteComponent } from './components/cast-vote/cast-vote.component';
import { ProposalDetailsComponent } from './components/proposal-details/proposal-details.component';
import { VoteResultsComponent } from './components/vote-results/vote-results.component';
import axios from 'axios';
import { environment as env } from '../../../../environments/environment.prod';
import { marked } from 'marked';
import { SnapshotService } from '@app/core/services/vote/snapshot.service';



@Component({
  selector: 'app-proposal',
  templateUrl: `./proposal.component.html`,
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {
  @Input() proposalID!: string;
  @Input() voteCounts: any;
  // core = [
  //   '0x74bb5cbff3738eca2307fbea15b0ff85c4fddd41',
  //   '0x1c04ee5fb9a916ea47a4497fd62dbc45c54f42a8'
  // ];
  status!: string;
  proposal!: any;
  start!: any;
  end!: any;
  body!: any;

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.proposalID = id;
    });
    await this.loadProposal(this.proposalID);
  }

  constructor(public snapshotService:SnapshotService, private route: ActivatedRoute, private router: Router) { }

  checkStatus() {
    if (this.proposal.state === 'active') {
      this.status = 'NOW';
    }
    else if (this.proposal.state === 'pending') {
      this.status = 'SOON';
    }
    else {
      this.status = 'closed';
    }
  }
  backToOverview() {
    this.router.navigate(['/vote']);
  }
  checkCreator() {
    // if (env.core.includes(this.proposal.author.toLowerCase())) {
    if (this.snapshotService.space.admins.some((item: string) => item.toLowerCase() === this.proposal.author.toLowerCase())) {
      this.proposal.creator = "CORE";
    } else {
      this.proposal.creator = "COMMUNITY";
    }
  }


  async loadProposal(proposalID: string) {
    try {
      const response = await axios.post(env.url_subgraph_vote, {
        query: `
        query loadProposal {
          proposal(id:"${proposalID}") {
            id
            start
            title
            body
            end
            snapshot
            author
            state
          }
        }
      `
      });

      this.proposal = response.data.data.proposal;
      const startDate = new Date(this.proposal.start * 1000);
      const endDate = new Date(this.proposal.end * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      this.body = marked.parse(this.proposal.body);
      const formatter = new Intl.DateTimeFormat('en-US', options);
      this.start = formatter.format(startDate);
      this.end = formatter.format(endDate);
      await this.checkStatus();
      await this.checkCreator();
    } catch (error) {
      console.error(error);
    }
  }
}
