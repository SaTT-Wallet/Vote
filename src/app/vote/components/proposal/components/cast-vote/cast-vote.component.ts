import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { Console } from 'console';
import { environment as env } from '../../../../../../environments/environment.prod';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';
import { ExternalWalletService } from '@app/core/services/vote/external-wallet.service';
import { SnapshotService } from '@app/vote/snapshot.service';
import { NotificationService } from '@app/core/services/notification/notification.service';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.scss']
})
export class CastVoteComponent implements OnInit {

  @Input() proposalID!: string;
  choices: string[] = [];
  voteButtonDisabled = true;
  selectedChoice: number | undefined;
  isConnectDialog: boolean = false;
  isNotInstalled: boolean = false;
  isConfirmVote: boolean = false;
  isVPDialog: boolean = false;
  selectedChoiceText: string = '';
  provider!: any;
  account!: string[];
  public walletConnected!: boolean;
  public walletId: string = '';
  // vp: any;
  web3 !: Web3Provider;

  constructor(
    // private location: Location,
    public notificationService: NotificationService,
    private snapshotService: SnapshotService, public externalWalletService: ExternalWalletService,) { }

  async ngOnInit(): Promise<void> {
    await this.loadChoices(this.proposalID);
    this.voteButtonDisabled = true;
    setInterval(async () => {
      await this.checkWalletConnected();
    }, 700);
  }
  updateSelectedChoiceText(choice: string) {
    this.selectedChoiceText = choice;
  }

  showConnectDialog() {
    this.isConnectDialog = true;
    document.body.classList.add('popup-visible');
  }
  hideConnectDialog() {
    this.isConnectDialog = false;
    document.body.classList.remove('popup-visible');
  }

  showConfirmVote() {
    this.isConfirmVote = true;
    document.body.classList.add('popup-visible');
  }
  hideConfirmVote() {
    this.isConfirmVote = false;
    document.body.classList.remove('popup-visible');
  }

  showVPDialog() {
    this.hideConfirmVote();
    this.isVPDialog = true;
    document.body.classList.add('popup-visible');
  }
  hideVPDialog() {
    this.isVPDialog = false;
    document.body.classList.remove('popup-visible');
  }

  showNetworkHasChanged() {
    document.body.classList.add('popup-visible');
  }
  hideNetworkHasChanged() {
    this.externalWalletService.networkHasChanged = false;
    document.body.classList.remove('popup-visible');
  }

  showInstall() {
    this.isNotInstalled = true;
    document.body.classList.add('popup-visible');
  }
  hideInstall() {
    this.isNotInstalled = false;
    document.body.classList.remove('popup-visible');
  }

  async changeNetwork() {
    // if (this.externalWalletService.networkHasChanged) {
      await this.externalWalletService.changeToBinance(window.ethereum).then(() => {
        this.hideNetworkHasChanged();
      })
        .catch((error) => {
          // this.hide();
        });
    // }
  }
  Disconnect() {
    this.externalWalletService.disconnectMetamask();
    this.hideNetworkHasChanged();
  }
  connectWallet = async (walletType: string) => {
    if (walletType === 'metamask') {
      if (this.externalWalletService.isMetaMaskInstalled) {
        this.provider = await this.externalWalletService.connectMetamask();
      } else {
        this.showInstall();
      }
      if (this.externalWalletService.connect === true) {
      }
    } else if (walletType === 'trust') {
      // this.provider = await this.externalWalletService.connectTrust();
    } else {
      throw new Error('Invalid wallet type');
    }
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
      await this.externalWalletService.checkConnectedWallet();
    }
    // const dialog = document.querySelector('dialog');
    // if (dialog) {
    //   dialog.close();
    // }
    this.hideConnectDialog();
  }

  checkWalletConnected = async () => {
    // console.log("body", this.createProposalForm.value.body)
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await this.externalWalletService.checkConnectedWallet();
      if (accounts.length > 0) {
        this.walletConnected = true;
        this.walletId = accounts[0];
        // this.formattedCreator = `${this.walletId.substr(0, 4)}...${this.walletId.substr(-3)}`;
        // this.vp = await this.snapshotService.getVotingPower(this.walletId);
      }

    }
  }
  

  async loadChoices(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
      query loadChoices {
        proposal(id:"${proposalID}") {
          id
          choices
        }
      }
    `,
    });
    this.choices = response.data.data.proposal.choices;
  }

  async submitVote() {
    if (this.selectedChoice !== undefined && this.selectedChoice !== null) {
      // const choice = (this.selectedChoice);
      // console.log(choice)
      const proposalData = {
        id: this.proposalID,
        choiceNumber: this.selectedChoice
      };
      // console.log("choice",this.selectedChoice)
      // console.log(proposalData)
      const receipt = await this.snapshotService.castVote(proposalData).then(() => {
        this.hideConfirmVote()
        // this.location.reload();
        this.selectedChoice=undefined;
        this.notificationService.showNotification('Your vote has been cast successfully.', true);
      })
      .catch((error) => {
        // console.log(error);
        this.selectedChoice=undefined;
        this.hideConfirmVote();
        this.notificationService.showNotification('Error casting vote.', false);
      });
      // console.log(receipt);
      // this.hideModal();
    }
  }
}




// import { Component, Input, OnInit } from '@angular/core';
// import { SnapshotService } from '@app/core/services/vote/snapshot.service';
// import axios from 'axios';
// import { environment as env } from '../../../../../../environments/environment.prod';

// @Component({
//   selector: 'app-cast-vote',
//   templateUrl: './cast-vote.component.html',
//   styleUrls: ['./cast-vote.component.scss']
// })
// export class CastVoteComponent implements OnInit {

//   @Input() proposalID!: string;
//   choices!: any[];
//   voteButtonDisabled = true;
//   selectedChoice!: number;

//   constructor(private snapshotService: SnapshotService) { }

//   async ngOnInit(): Promise<void> {
//     await this.loadChoices(this.proposalID);
//   }

//   async loadChoices(proposalID: string) {
//     const response = await axios.post(env.url_subgraph_vote, {
//       query: `
//       query loadChoices {
//         proposal(id:"${proposalID}") {
//           id
//           choices
//         }
//       }
//     `,
//     });
//     this.choices = response.data.data.proposal.choices;
//   }

//   async submitVote() {
    
//     const proposalData = {
//       id: this.proposalID,
//       choiceNumber: this.selectedChoice
//     };
//     const receipt = await this.snapshotService.castVote(proposalData);
//     console.log(receipt);
//   }
// }
