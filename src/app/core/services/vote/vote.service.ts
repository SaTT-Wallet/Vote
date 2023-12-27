import { Injectable } from '@angular/core';
import { Web3Provider } from '@ethersproject/providers';
import { environment as env } from '../../../../environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Cookies from 'js-cookie';
import { ApiprofilService } from '@app/apiprofil.service';
import { ExternalWalletService } from './external-wallet.service';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
@Injectable({
  providedIn: 'root'
})
export class VoteService {

  public walletConnected!: boolean;
  public walletId: string = '';
  web3 !: Web3Provider;
  isNotInstalled: boolean = false;
  isConnectDialog: boolean = false;
  provider!: any;
  account!: string[];
  formattedCreator: string | undefined;

  private previousWalletId!: string;

  constructor(public externalWalletService: ExternalWalletService,private router: Router, public apiprofilService:ApiprofilService, public modalService: NgbModal, public tokenStorageService: TokenStorageService) { }

  showConnectDialog(content?: any) {
    this.modalService.open(content)
    
  }
  hideConnectDialog(content?:any) {
    this.modalService.dismissAll(content);
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
    await this.externalWalletService.changeToBinance(window.ethereum).then(() => {
      this.hideNetworkHasChanged();
    })
      .catch((error) => {
      });
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
    console.log(typeof window.ethereum !== 'undefined')
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
      this.createAccount(this.account[0])
      await this.externalWalletService.checkConnectedWallet();
    }

    //this.hideConnectDialog();
  }

 createAccount(wallet:any):void {

  console.log({wallet})
  this.apiprofilService.createUser(wallet.toLowerCase()).subscribe(
    (res:any) => {
      console.log({res})
     Cookies.set('userId', res.data.UserId)
    }, (err:any) => {
      console.error(err)
    }
  );
  
   
 }

  detectAccountChange(): void {
    if (typeof window.ethereum ) {
      window.ethereum .on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
          console.log("newAccountnewAccountnewAccount",newAccount)
          this.createAccount(newAccount)
        }
      });
    }
  }
  



  checkWalletConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await this.externalWalletService.checkConnectedWallet();
      if (accounts.length > 0) {
        this.walletConnected = true;
        this.walletId = accounts[0];
        this.tokenStorageService.saveIdWallet(this.walletId)
        if (this.walletId !== this.previousWalletId) {
          this.previousWalletId = this.walletId;
           if (this.router.url === '/farm-posts/no-posts-to-farm' || this.router.url === '/farm-posts') {
            this.router.navigateByUrl('/farm-posts');
          }
        }
        this.formattedCreator = `${this.walletId.substr(0, 4)}...${this.walletId.substr(-3)}`;     
      

      
      }
    }
  }


}