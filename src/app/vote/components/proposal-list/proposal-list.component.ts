import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment as env } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Proposal } from '@app/models/proposal.model';
import { SnapshotService } from '@app/core/services/vote/snapshot.service';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss']
})


export class ProposalListComponent implements OnInit {
  proposals: any[] = [];
  prop: any[] = [];
  proposals$: Observable<Proposal[]> | undefined;
  authorFilter: string | null = null;
  stateFilter: string | null = null;
  activeButton!: string;
  creator!: string;
  votingStatus!: string;
  admins: any[] = [];
  // start!:any;
  // end!:any;

  // core = [
  //   '0x74bb5cbff3738eca2307fbea15b0ff85c4fddd41',
  //   '0x1c04ee5fb9a916ea47a4497fd62dbc45c54f42a8'
  // ];
  constructor(public snapshotService: SnapshotService, private route: ActivatedRoute, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.snapshotService.getSpace();
    this.admins = this.snapshotService.admins;
    this.activeButton = 'CORE';
    this.votingStatus = 'NOW';
    this.stateFilter = this.votingStatus === 'NOW' ? 'active' : this.votingStatus === 'SOON' ? 'pending' : 'closed';
    await this.loadProposals('CORE');
    // setInterval(async () => {
    // }, 1000);
  }

  async onButtonClick(button: string) {
    this.activeButton = button;
    switch (this.activeButton) {
      case 'CORE':
        for (let i = 0; i < this.proposals.length; i++) {
          // if (env.core.includes(this.proposals[i].author.toLowerCase())) {
          if (this.snapshotService.space.admins.some((item: string) => item.toLowerCase() === this.proposals[i].author.toLowerCase())) {
            this.prop.push(this.proposals[i])
          }
        }
        if (this.prop.length === 0) {
          this.proposals = [];
        } else {
          this.proposals = this.prop;
          this.prop = [];
        }
        break;
      case 'COMMUNITY':
        for (let i = 0; i < this.proposals.length; i++) {
          if (!this.snapshotService.space.admins.some((item: string) => item.toLowerCase() === this.proposals[i].author.toLowerCase())) {
            this.prop.push(this.proposals[i])
          }
        }
        if (this.prop.length === 0) {
          this.proposals = [];
        } else {
          this.proposals = this.prop;
          this.prop = [];
        }
        break;
      case 'ALL':
        await this.loadProposals();
        break;
      default:
        console.warn(`Unknown button "${this.activeButton}", keeping all proposals`);
        break;
    }
  }

  async checkAuthor() {
    for (let i = 0; i < this.proposals.length; i++) {
      if (this.snapshotService.space.admins.some((item: string) => item.toLowerCase() === this.proposals[i].author.toLowerCase())) {
        this.proposals[i].creator = "CORE";
      } else {
        this.proposals[i].creator = "COMMUNITY";
      }
    }
  }


  async onVotingStatusChange(event: Event) {
    this.votingStatus = (event.target as HTMLInputElement).value;

    if (this.votingStatus === 'NOW') {
      this.stateFilter = 'active';
    }
    else if (this.votingStatus === 'SOON') {
      this.stateFilter = 'pending';
    }
    else {
      this.stateFilter = 'closed';
    }

    await this.loadProposals(this.activeButton);

    // if (this.activeButton === 'CORE') {
    //   await this.onButtonClick('CORE');
    // }
    // else if (this.activeButton === 'COMMUNITY') {
    //   await this.onButtonClick('COMMUNITY');
    // }

  }

  goToProposal(id: string) {
    this.router.navigate(['/vote/proposal', id]);
  }


  async loadProposals(button?: string) {
    try {
      const response = await axios.post(env.url_subgraph_vote, {
        query: `
        query  {
          proposals (
            first: 20,
            skip: 0,
            where: {
              space_in: "${env.space_name}",
              state: "${this.stateFilter}"
            },
            orderBy: "created",
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            scores
            scores_by_strategy
            scores_total
            scores_updated
            author
            space {
              id
              name
            }
          }
        }
        `
      });
      this.proposals = response.data.data.proposals;
      for (let i = 0; i < this.proposals.length; i++) {
        const startDate = new Date(this.proposals[i].start * 1000);
        const endDate = new Date(this.proposals[i].end * 1000);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        this.proposals[i].start = formatter.format(startDate);
        this.proposals[i].end = formatter.format(endDate);
      }
      if (button === 'CORE') {
        await this.onButtonClick('CORE');
      }
      else if (button === 'COMMUNITY') {
        await this.onButtonClick('COMMUNITY');
      } else if (button === 'ALL') {
        this.activeButton = 'ALL';
      }

      await this.checkAuthor();
    } catch (error) {
      console.error(error);
    }
  }

  // getProposalStateClass(proposalState: string) {
  //   switch (proposalState) {
  //     case 'active':
  //       return 'button-active';
  //     case 'pending':
  //       return 'button-soon';
  //     case 'closed':
  //       return 'button-closed';
  //     default:
  //       return '';
  //   }
  // }
}


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import axios from 'axios';
// import { environment as env } from '../../../../environments/environment';

// @Component({
//   selector: 'app-proposal-list',
//   templateUrl: './proposal-list.component.html',
//   styleUrls: ['./proposal-list.component.scss']
// })
// export class ProposalListComponent implements OnInit {
//   proposals: any[] = [];
//   core = ['0x942051828f586303e1FB143B6B4723d46b06fb98', '0x942051324f586505e1CD143B6B4723d46b06fb98'];

//   constructor(private router: Router) { }

//   async ngOnInit(): Promise<void> {
//     await this.loadProposals();
//   }

//   activeButton = 'CORE';

//   onButtonClick(button: string) {
//     this.activeButton = button;
//   }
//   goToProposal(id: string) {
//     this.router.navigate(['/vote/proposal', id]);
//   }

//   // proposal(id: string): any {
//     // this.router.navigateByUrl(`/proposal/${id}`), { relativeTo: this.route };

//     // this.router.navigate(
//     //   ['/proposal'],
//     //   { queryParams: { id: id } }
//     // );
//   // }


//   async loadProposals() {
//     try {
//       const response = await axios.post(env.url_subgraph_vote, {
//         query: `
//         query  {
//           proposals (
//             first: 20,
//             skip: 0,
//             where: {
//               space_in: "${env.space_name}",
//             },
//             orderBy: "created",
//             orderDirection: desc
//           ) {
//             id
//             title
//             body
//             choices
//             start
//             end
//             snapshot
//             state
//             scores
//             scores_by_strategy
//             scores_total
//             scores_updated
//             author
//             space {
//               id
//               name
//             }
//           }
//         }
//         `

//       });
//       this.proposals = response.data.data.proposals;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }
