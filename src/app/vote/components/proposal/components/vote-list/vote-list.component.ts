import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { environment as env } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-vote-list',
  templateUrl: './vote-list.component.html',
  styleUrls: ['./vote-list.component.scss']
})
export class VoteListComponent implements OnInit {
  @Input() proposalID!: string;
  state!: string
  blockExplorerURL = env.blockExplorerURL;
  votes: any[] = [];
  choices: string[] = [];
  displayedVotes!: any[];
  loadAllVotes: boolean = false;

  ngOnInit() {
    this.loadData();

    // Refresh the data every 5 seconds
    setInterval(() => {
      this.loadData();
    }, 1000);
  }

  async loadData() {
    await Promise.all([this.loadState(this.proposalID), this.loadChoices(this.proposalID), this.loadVotes(this.proposalID)]);
    this.loadInitialVotes();
  }

  loadInitialVotes() {
    this.displayedVotes = this.votes.slice(0, 10);
    this.loadAllVotes = false;
  }

  loadAll() {
    this.displayedVotes = this.votes;
    this.loadAllVotes = true;
  }

  async loadState(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
        query loadState {
          proposal(id: "${proposalID}") {
            state
          }
        }
      `,
    });
    this.state = response.data.data.proposal.state;
  }

  async loadChoices(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
        query loadChoices {
          proposal(id: "${proposalID}") {
            id
            choices
          }
        }
      `,
    });
    this.choices = response.data.data.proposal.choices;
  }

  async loadVotes(proposalID: string) {
    try {
      const response = await axios.post(env.url_subgraph_vote, {
        query: `
          query loadVotes($proposalID: String!) {
            votes(
              first: 1000
              skip: 0
              where: {
                proposal: $proposalID
              }
              orderBy: "created"
              orderDirection: desc
            ) {
              voter
              choice
              vp
              vp_by_strategy
            }
          }
        `,
        variables: {
          proposalID: this.proposalID
        }
      });
      this.votes = response.data.data.votes;
      for (let i = 0; i < this.votes.length; i++) { this.votes[i].formattedVoter = `${this.votes[i].voter.substr(0, 4)}...${this.votes[i].voter.substr(-3)}`; }
    } catch (error) {
      console.error(error);
    }
  }
}
