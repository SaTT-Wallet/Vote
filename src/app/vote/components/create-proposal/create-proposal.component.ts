import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExternalWalletService } from '../../../core/services/vote/external-wallet.service';
import { FormControl, FormGroup, FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
// import { SnapshotService } from '@app/core/services/vote/snapshot.service';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';
import { environment as env } from '../../../../environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';
// import * as marked from 'marked';
import TurndownService from 'turndown';
// import { SnapshotService } from 'src/app/core/services/vote/snapshot.service';
import { marked } from 'marked';
import { Proposal } from '@app/models/proposal.model';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { SnapshotService } from '@app/vote/snapshot.service';

declare global {
  interface Window {
    ethereum?: any
  }
}


@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss']
})
export class CreateProposalComponent implements OnInit, OnDestroy {
  blockExplorerURL = env.blockExplorerURL;
  createProposalObj: Proposal = {
    type: 'single-choice' as ProposalType,
  }
  web3 !: Web3Provider;
  formattedCreator: string | undefined;
  isConnectDialog: boolean = false;
  isVPDialog: boolean = false;
  isNotInstalled: boolean = false;
  account!: string[];
  titleMaxLength = 81;



  // public walletConnected: boolean = false;
  public walletConnected!: boolean;
  showSpinner: boolean = false;
  public walletId: string = '';
  checkWallet: any;
  i: number = 0;
  // vp: any;
  // choices: any[] = [{}, {}];
  snapshot!: any;
  provider!: any;
  bodyModel: string = '';
  proposalForm: FormGroup | undefined;
  bodyText!: string;
  charactersRemaining: number = 0;

  removeChoice(index: number) {
    if (this.choicesArray.length > 2 && index > 1) {
      this.choicesArray.removeAt(index);
    }
  }

  editorConfig = {
    // Add your other ngx-editor configurations here
    // placeholder: 'Type your text...',
    // Set the maximum character limit
    charCounterMax: 10000
  };

  onInputChange(event: any) {
    this.bodyModel = event.target.value;
  }

  limitInputLength(length: number, event: any): void {
    let input = event.target as HTMLInputElement;
    let inputValue = input.value;
    if (inputValue.length >= length) {
      input.value = inputValue.slice(0, length);
    }
  }

  editor = new Editor();

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['bullet_list', 'ordered_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link']
  ];

  constructor(public notificationService: NotificationService, private spinner: NgxSpinnerService, private snapshotService: SnapshotService, public externalWalletService: ExternalWalletService, private http: HttpClient, private fb: FormBuilder, private router: Router) {
    // this.charactersRemaining = this.editorConfig.charCounterMax;
  }

  async ngOnInit(): Promise<void> {

    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      // console.log(this.web3);
      this.account = await this.web3.listAccounts();
      this.snapshot = await this.snapshotService.getBlockNumber();
    } else {
      const httpProvider = new Web3.providers.HttpProvider(env.bsc_node);
      const web3 = new Web3(httpProvider);
      // this.web3 = web3.eth as unknown as Web3Provider;
      const blockNumber: bigint = BigInt(await web3.eth.getBlockNumber());
      this.snapshot = Number(blockNumber);
      
      // await web3.eth.getBlockNumber((error: any, blockNumber: any) => {
      //   if (error) {
      //     console.error(error);
      //   } else {
      //     this.snapshot = blockNumber;
      //     // console.log("Current block number: " + blockNumber);
      //   }
      // });
    }
    setInterval(async () => {
      await this.checkWalletConnected();
    }, 700);
    this.editor = new Editor();
    // console.log(typeof (this.createProposalForm.get('title')))
  }
  ngOnDestroy() {

  }

  updateCharactersRemaining() {
    const turndownService = new TurndownService();
    // this.bodyModel = turndownService.turndown(this.createProposalForm.value.body ?? '');
    this.bodyModel = this.createProposalForm.value.body ?? '';
    this.charactersRemaining = this.removeHTMLAttributes(this.bodyModel).length;
  }

  removeHTMLAttributes(htmlString: string): string {
    return htmlString.replace(/<[^>]*>/g, '');
  }
  addChoice() {
    // this.choices.push({});
    this.choicesArray.push(new FormControl('', [Validators.required, Validators.maxLength(32)]))
  }
  // addChoice() {
  //   if (this.choices.length < 2) {
  //     this.choices.push({ text: '' });
  //   }
  // }
  choicesArray = new FormArray([
    new FormControl('', [Validators.required, Validators.maxLength(32)]),
    new FormControl('', [Validators.required, Validators.maxLength(32)])
  ]);

  createProposalForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    body: new FormControl('', [Validators.required, Validators.maxLength(10000)]),

    choices: this.choicesArray,
    startDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  get formattedContent() {
    const prev = this.removeHTMLAttributes(this.bodyModel)
    if (prev.trim() === "") {
      return null;
    }
    else {
      return this.bodyModel
    }
  }

  isTimeCorrect(): boolean {
    // const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
    // const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
    // return startDateTime < endDateTime;
    if (this.createProposalForm.value.startDate !== '' && this.createProposalForm.value.endDate !== '') {
      const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
      const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);

      if (this.createProposalForm.value.startDate === this.createProposalForm.value.endDate) {
        if (this.createProposalForm.value.startTime !== '' && this.createProposalForm.value.endTime !== '') {
          const startTimeUnix = startDateTime.getHours() * 3600000 + startDateTime.getMinutes() * 60000;
          const endTimeUnix = endDateTime.getHours() * 3600000 + endDateTime.getMinutes() * 60000;
          return startTimeUnix < endTimeUnix;
        } else {
          return true;
        }
      } else {
        const startDateTimeUnix = startDateTime.getTime();
        const endDateTimeUnix = endDateTime.getTime();
        return startDateTimeUnix < endDateTimeUnix;
      }
    } else {
      return true;
    }
  }

  isFormFilled(): boolean {
    if (this.createProposalForm.value.title !== '' && !this.hasEmptyChoiceText() && this.isTimeCorrect() && this.formattedContent !== null && this.createProposalForm.value.startDate !== '' && this.createProposalForm.value.startTime !== '' && this.createProposalForm.value.endDate !== '' && this.createProposalForm.value.endTime !== '' && (this.externalWalletService.vp.vp >= 10000) && (this.charactersRemaining <= 10000)) {
      return false;
    } else {
      return true;
    }
  }

  async updateContent() {
    if (this.createProposalForm.controls.body.value !== null) {
      if (this.charactersRemaining <= this.editorConfig.charCounterMax) {
        this.bodyModel = this.createProposalForm.controls.body.value;
      }
      await this.updateCharactersRemaining();
    }
  }

  // checkCharacterLimit() {
  //   if (this.bodyModel.length > this.editorConfig.charCounterMax) {
  //     // Truncate the bodyModel to the character limit
  //     this.bodyModel = this.bodyModel.substr(0, this.editorConfig.charCounterMax);
  //   }
  //   this.updateCharactersRemaining();
  // }

  // updateContent() {
  //   const inputValue = this.createProposalForm.controls.body.value;
  //   if (inputValue !== null) {
  //     // Trim content if it exceeds the maxlength
  //     if (inputValue.length > 14399) {
  //       this.createProposalForm.controls.body.setValue(inputValue.substring(0, 14399));
  //     }
  //     this.bodyModel = inputValue;
  //   }
  // }

  checkWalletConnected = async () => {
    // console.log("body", this.createProposalForm.value.body)
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await this.externalWalletService.checkConnectedWallet();
      if (accounts.length > 0) {
        this.walletConnected = true;
        this.walletId = accounts[0];
        this.formattedCreator = `${this.walletId.substr(0, 4)}...${this.walletId.substr(-3)}`;
        // if (this.externalWalletService.networkHasCHanged) {
        //   this.externalWalletService.changeToBinance(window.ethereum);
        // }
      }

    }
  }

  // connectWallet = async () => {
  //   this.provider = await this.externalWalletService.connectWallet();
  //   if (typeof window.ethereum !== 'undefined') {
  //     this.web3 = new Web3Provider(window.ethereum);
  //     this.account = await this.web3.listAccounts();
  //     localStorage.setItem("accounts", this.account[0])
  //     await this.externalWalletService.connectWallet();
  //     await this.checkWalletConnected();
  //   }
  //   const dialogElement = document.querySelector('dialog');
  //   if (dialogElement) {
  //     dialogElement.close();
  //   }
  // }

  connectWallet = async (walletType: string) => {
    if (walletType === 'metamask') {
      if (this.externalWalletService.isMetaMaskInstalled) {
        this.provider = await this.externalWalletService.connectMetamask();
      } else {
        // this.isNotInstalled = true;
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
      localStorage.setItem("accounts", this.account[0]);
      await this.externalWalletService.checkConnectedWallet();
    }
    // const dialog = document.querySelector('dialog');
    // if (dialog) {
    //   dialog.close();
    // }
    // if (!this.isNotInstalled) {
    this.hideConnectDialog();
    // }
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

  hasEmptyChoiceText(): boolean {
    for (let i = 0; i < this.choicesArray.length; i++) {
      let choice = this.choicesArray.at(i);
      if (choice.value === null || choice.value === undefined || choice.value === '') {
        return true;
      }
    }
    return false;
  }


  showConnectDialog() {
    this.isConnectDialog = true;
    document.body.classList.add('popup-visible');
  }
  hideConnectDialog() {
    this.isConnectDialog = false;
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

  showVPDialog() {
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

  Disconnect() {
    this.externalWalletService.disconnectMetamask();
    this.hideNetworkHasChanged();
  }
  async publish() {
    if ((!this.externalWalletService.isWalletConnected) || (!this.externalWalletService.connect)) {
      return;
    }
    // console.log("ey")
    this.showSpinner = true;
    if (this.showSpinner) {
      await this.spinner.show();
    }
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(this.createProposalForm.value.body ?? '', 'text/html');
    this.bodyText = parsedHtml.body.textContent ? parsedHtml.body.textContent : '';
    this.createProposalObj.title = this.createProposalForm.value.title ?? '';
    // this.createProposalObj.body = this.bodyText;
    const turndownService = new TurndownService();
    this.createProposalObj.body = turndownService.turndown(this.createProposalForm.value.body ?? '');
    // const choiceTexts = this.choices.map(choice => choice.toString());
    // this.createProposalObj.choices = choiceTexts;
    // this.createProposalObj.choices = [];
    this.createProposalObj.choices = this.choicesArray.controls
      .map(control => control.value)
      .filter(value => value !== null)
      .map(value => value?.toString() ?? '');
    // console.log(this.createProposalObj.choices)
    const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
    const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
    this.createProposalObj.start = (startDateTime.getTime()) / 1000;
    this.createProposalObj.end = (endDateTime.getTime()) / 1000;
    // this.createProposalObj.from = localStorage.getItem("accounts") || "aa";
    // this.createProposalObj.space = "atayen.eth",
    // this.createProposalObj.type = 'single-choice' as ProposalType,
    // console.log(this.snapshot)
    this.createProposalObj.snapshot = this.snapshot;
    // this.createProposalObj.app = "SaTT-Token"
    // console.log(this.createProposalObj)
    await this.snapshotService.createProposal(this.createProposalObj)
      .then(() => {
        this.showSpinner = false;
        if (!this.showSpinner) {
          this.spinner.hide();
        }
        this.notificationService.showNotification('Proposal created successfully.', true);
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log(error)
        this.showSpinner = false;
        if (!this.showSpinner) {
          this.spinner.hide();
        }
        this.notificationService.showNotification('Error creating proposal.', false);
      });

  }
}

















// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { MetaMaskService } from '../../../core/services/vote/meta-mask.service';
// import { FormControl, FormGroup, FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';
// import { Editor, Toolbar } from 'ngx-editor';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Proposal } from '@app/models/proposal.model';
// import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
// import { SnapshotService } from '@app/core/services/vote/snapshot.service';
// import { Web3Provider } from '@ethersproject/providers';
// import Web3 from 'web3';
// import { environment as env } from '../../../../environments/environment.prod';


// declare global {
//   interface Window {
//     ethereum?: any
//   }
// }


// @Component({
//   selector: 'app-create-proposal',
//   templateUrl: './create-proposal.component.html',
//   styleUrls: ['./create-proposal.component.scss']
// })
// export class CreateProposalComponent implements OnInit, OnDestroy {

//   createProposalObj: Proposal = {
//     type: 'single-choice' as ProposalType,
//   }
//   web3 !: Web3Provider;


//   account!: string[];

//   // public walletConnected: boolean = false;
//   public walletConnected!: boolean;
//   public walletId: string = '';
//   checkWallet: any;
//   i: number = 0;

//   choices = [{ text: '' }, { text: '' }];
//   snapshot!: any;
//   provider!: any;
//   bodyModel: string = '';
//   proposalForm: FormGroup | undefined;
//   bodyText!: string;

//   removeChoice(index: number) {
//     if (this.choices.length > 2 && index > 1) {
//       this.choices.splice(index, 1);
//     }
//   }

//   onInputChange(event: any) {
//     this.bodyModel = event.target.value;
//   }

//   editor = new Editor();

//   toolbar: Toolbar = [
//     ['bold', 'italic'],
//     // ['underline', 'strike'],
//     ['blockquote'],
//     ['bullet_list', 'ordered_list'],
//     [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
//     // ['text_color', 'background_color'],
//     // ['align_left', 'align_center', 'align_right', 'align_justify'],
//     ['link']
//   ];

//   constructor(private snapshotService: SnapshotService, public metaMaskService: MetaMaskService, private http: HttpClient, private fb: FormBuilder, private router: Router) {
//   }

//   async ngOnInit(): Promise<void> {
//     if (typeof window.ethereum !== 'undefined') {
//       this.web3 = new Web3Provider(window.ethereum);
//       // console.log(this.web3);
//       this.account = await this.web3.listAccounts();
//     } else {
//       const httpProvider = new Web3.providers.HttpProvider(env.bsc_node);
//       const web3 = new Web3(httpProvider);
//       this.web3 = web3.eth as unknown as Web3Provider;
//     }
//     this.editor = new Editor();
//     setInterval(async () => {
//       await this.checkWalletConnected();
//     }, 500);
//     this.snapshot = await this.snapshotService.getBlockNumber();
//   }
//   ngOnDestroy() {

//   }

//   removeHTMLAttributes(htmlString: string): string {
//     return htmlString.replace(/<[^>]*>/g, '');
//   }
//   addChoice() {
//     this.choices.push({ text: '' });
//   }
//   // addChoice() {
//   //   if (this.choices.length < 2) {
//   //     this.choices.push({ text: '' });
//   //   }
//   // }
//   choicesArray = new FormArray([
//     new FormControl('', [Validators.required])
//   ]);

//   createProposalForm = new FormGroup({
//     title: new FormControl('', [Validators.required]),
//     body: new FormControl('', [Validators.required]),

//     choices: this.choicesArray,
//     startDate: new FormControl('', [Validators.required]),
//     startTime: new FormControl('', [Validators.required]),
//     endDate: new FormControl('', [Validators.required]),
//     endTime: new FormControl('', [Validators.required]),
//   });

//   get formattedContent() {
//     const prev = this.removeHTMLAttributes(this.bodyModel)
//     if (prev.trim() === "") {
//       return null;
//     }
//     else {
//       return this.bodyModel
//     }
//   }

//   isButtonDisabled(): boolean {
//     const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
//     const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
//     return startDateTime >= endDateTime;
//   }

//   updateContent() {
//     if (this.createProposalForm.controls.body.value !== null) {
//       this.bodyModel = this.createProposalForm.controls.body.value;
//     }
//   }

//   checkWalletConnected = async () => {
//     if (typeof window.ethereum !== 'undefined') {
//       const accounts = await this.metaMaskService.checkWalletConnected();
//       if (accounts.length > 0) {
//         this.walletConnected = true;
//         this.walletId = accounts[0];
//       }
//     }
//   }

//   connectWallet = async () => {
//     this.provider = await this.metaMaskService.connectWallet();
//     if (typeof window.ethereum !== 'undefined') {
//       this.web3 = new Web3Provider(window.ethereum);
//       this.account = await this.web3.listAccounts();
//       localStorage.setItem("accounts", this.account[0])
//       await this.metaMaskService.connectWallet();
//       await this.checkWalletConnected();
//     }
//     const dialogElement = document.querySelector('dialog');
//     if (dialogElement) {
//       dialogElement.close();
//     }
//   }

//   hasEmptyChoiceText(): boolean {
//     return this.choices.some(choice => choice.text === '');
//   }

//   // publish() {
//   //   debugger
//   //   const parser = new DOMParser();
//   //   const parsedHtml = parser.parseFromString(this.createProposalForm.value.body ?? '', 'text/html');
//   //   this.bodyText = parsedHtml.body.textContent ? parsedHtml.body.textContent : '';
//   //   this.createProposalObj.title = this.createProposalForm.value.title ?? '';
//   //   this.createProposalObj.body = this.bodyText;
//   //   const choiceTexts = this.choices.map(choice => choice.text);
//   //   this.createProposalObj.choices = choiceTexts;
//   //   const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
//   //   const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
//   //   this.createProposalObj.start = (startDateTime.getTime()) / 1000;
//   //   this.createProposalObj.end = (endDateTime.getTime()) / 1000;
//   //   this.createProposalObj.from = localStorage.getItem("accounts") || "aa",
//   //     this.createProposalObj.space = "atayen.eth",
//   //     this.createProposalObj.type = 'single-choice' as ProposalType,
//   //     this.createProposalObj.snapshot = this.snapshot,
//   //     this.createProposalObj.app = "SaTT-Token"
//   //   console.log(this.createProposalObj);
//   //   this.snapshotService.createProposal(this.createProposalObj)
//   // }
//   publish() {
//     if (!this.metaMaskService.isWalletConnected) {
//       return;
//     }
//     // if (this.createProposalForm.valid) {
//     const parser = new DOMParser();
//     const parsedHtml = parser.parseFromString(this.createProposalForm.value.body ?? '', 'text/html');
//     this.bodyText = parsedHtml.body.textContent ? parsedHtml.body.textContent : '';
//     this.createProposalObj.title = this.createProposalForm.value.title ?? '';
//     this.createProposalObj.body = this.bodyText;
//     console.log("publish",this.metaMaskService.isWalletConnected)
//     const choiceTexts = this.choices.map(choice => choice.text);
//     this.createProposalObj.choices = choiceTexts;
//     const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
//     const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
//     this.createProposalObj.start = (startDateTime.getTime()) / 1000;
//     this.createProposalObj.end = (endDateTime.getTime()) / 1000;
//     this.createProposalObj.from = localStorage.getItem("accounts") || "aa",
//       this.createProposalObj.space = "atayen.eth",
//       this.createProposalObj.type = 'single-choice' as ProposalType,
//       this.createProposalObj.snapshot = this.snapshot,
//       this.createProposalObj.app = "SaTT-Token"
//     console.log(this.createProposalObj);
//     this.snapshotService.createProposal(this.createProposalObj)
//     // }
//   }
// }
