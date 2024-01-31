import { Injectable, Renderer2, ElementRef, Inject } from '@angular/core';
import { Web3Provider } from '@ethersproject/providers';
import { environment as env } from '../../../../environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Cookies from 'js-cookie';
import { ApiprofilService } from '@app/apiprofil.service';
import { ExternalWalletService } from './external-wallet.service';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { DOCUMENT } from '@angular/common';
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

  constructor(public externalWalletService: ExternalWalletService,private router: Router, @Inject(DOCUMENT) private document: Document,public apiprofilService:ApiprofilService, public modalService: NgbModal, public tokenStorageService: TokenStorageService) { }

  showConnectDialog(content?: any) {
    this.modalService.open(content)
    
  }
  hideConnectDialog(content?:any) {
    this.modalService.dismissAll(content);
  }

  showNetworkHasChanged() {
    this.document.body.classList.add('popup-visible');
  }
  hideNetworkHasChanged() {
    this.externalWalletService.networkHasChanged = false;
    this.document.body.classList.remove('popup-visible');
  }

  showInstall() {
    this.isNotInstalled = true;
    this.document.body.classList.add('popup-visible');
  }
  hideInstall() {
    this.isNotInstalled = false;
    this.document.body.classList.remove('popup-visible');
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
      await this.externalWalletService.connectMetamask();
      if(!!window.ethereum) {
        this.web3 = new Web3Provider(window.ethereum);
        this.account = await this.web3.listAccounts();
        this.createAccount(this.account[0])
        await this.externalWalletService.checkConnectedWallet();
      }
      
    } else {
     console.error('we support only metamask for now!!!!');
    }
    
    //this.hideConnectDialog();
  }

 createAccount(wallet:any):void {
  this.apiprofilService.createUser(wallet.toLowerCase()).subscribe(
    (res:any) => {
     Cookies.set('userId', res.data.UserId)
    }, (err:any) => {
      console.error('Error in create account API : ' , err);
    }
  );
  
   
 }

  detectAccountChange(): void {
    if (typeof window.ethereum ) {
      window.ethereum .on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
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
        this.formattedCreator = `${this.walletId.substring(0, 7)}...${this.walletId.substring(this.walletId.length - 3)}`;     
      

      
      }
    }
  }


}