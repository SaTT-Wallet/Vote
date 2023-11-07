import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { environment as env } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent implements OnInit {
  @Input() proposalID!: string;
  votes: any[] = [];
  choix: any[] = [];
  choices: any[] = [];
  total: any = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadData();

    // Refresh the data every 5 seconds
    setInterval(() => {
      this.loadData();
    }, 1000);
  }

  async loadData(): Promise<void> {
    try {
      await Promise.all([this.loadChoices(this.proposalID), this.loadVotes(this.proposalID)]);
      this.calculateResults();
    } catch (error) {
      console.error(error);
    }
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
    this.choix = response.data.data.proposal.choices;
  }

  async loadVotes(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
        query loadVotes {
          votes(
            first: 1000
            skip: 0
            where: {
              proposal: "${proposalID}"
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
    });
    this.votes = response.data.data.votes;
  }

  calculateResults() {
    this.choices = this.choix.map((choice) => {
      return {
        vp: 0.0,
        choic: choice,
      };
    });

    this.total = 0;
    for (let i = 0; i < this.choix.length; i++) {
      for (let j = 0; j < this.votes.length; j++) {
        let vote = this.votes[j];
        if (vote.choice == (i + 1)) {
          this.choices[i].vp += parseFloat(vote.vp);
        }
      }
      this.total += this.choices[i].vp;
    }

    if (this.total === 0) {
      this.total = 100;
    }
  }
}
