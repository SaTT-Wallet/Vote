import { Injectable } from '@angular/core';
import { Web3Provider } from '@ethersproject/providers';
import { ExternalWalletService } from "src/app/core/services/vote/external-wallet.service";
import { environment as env } from '../../../../environments/environment.prod';
import { ApiprofilService } from 'src/app/apiprofil.service';

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


  constructor(public externalWalletService: ExternalWalletService,
    public apiprofilService:ApiprofilService ) { }



    
  showConnectDialog() {
    this.isConnectDialog = true;
    document.body.classList.add('popup-visible');
  }
  hideConnectDialog() {
    this.isConnectDialog = false;
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
    await this.externalWalletService.changeToBinance(window.ethereum).then(() => {
      this.hideNetworkHasChanged();
    })
      .catch((error) => {
      });
  }


  Disconnect() {
    this.externalWalletService.disconnectMetamask();
    // localStorage.setItem('connect', 'false');
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
       this.createAccount(this.account[0])
      await this.externalWalletService.checkConnectedWallet();
    }

    this.hideConnectDialog();
  }

 createAccount(wallet:any):void {

  this.apiprofilService.createUser(wallet.toLowerCase()).subscribe(
    (response) => {
      console.log('API response:', response);
    },
    (error) => {
      console.error('API error:', error);
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
        this.formattedCreator = `${this.walletId.substr(0, 4)}...${this.walletId.substr(-3)}`;     
      

      
      }
    }
  }


}
