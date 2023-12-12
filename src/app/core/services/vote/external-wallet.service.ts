import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';
import { environment as env } from '../../../../environments/environment.prod';
import { abi } from '../../../../environments/abi';
import Cookies from 'js-cookie';
import { SnapshotService } from '@app/vote/snapshot.service';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ExternalWalletService {
  public ethereum!: any;
  public isWalletConnected!: boolean;
  public connect: boolean = false;
  currentAccount: string = '';
  acc: string | any[] = [];
  public isMetaMaskInstalled: boolean = false;
  networkHasChanged: boolean = false;
  vp: any;
  latest_acc: string = '';


  constructor(private snapshotService: SnapshotService, private tokenStorageService :TokenStorageService) {
    this.detectMetaMask();
    const { ethereum } = <any>window;
    this.ethereum = ethereum;

    // if (this.isMetaMaskInstalled) {
    //   this.ethereum.on('disconnect', (error: any) => {
    //     this.handleDisconnect();
    //   });
    // }
  }

  async detectMetaMask() {
    const provider = await detectEthereumProvider();
    if (provider && provider.isMetaMask) {
      this.isMetaMaskInstalled = true;
    } else {
      this.isMetaMaskInstalled = false;
    }
  }

  generateSignature() {
    

      const timestamp = Date.now().toString();
      const message = `authentication=true&address=${this.ethereum.selectedAddress}&ts=${timestamp}`;
      //const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
     
       window.ethereum
      .request({
        method: 'personal_sign',
        params: [message, this.ethereum.selectedAddress],
      })
      .then((signature: string) => {
        // Handle the signature, you can send it to the server if needed
        console.log('Signature:', signature);
        Cookies.set('metamaskSignature', signature, { secure: true, sameSite: 'Lax' });
        Cookies.set('metamaskAddress', this.ethereum.selectedAddress, { secure: true, sameSite: 'Lax' });
        Cookies.set('metamaskNonce', message, { secure: true, sameSite: 'Lax' });
      })
      .catch((error: any) => {
        console.error('Error prompting for signature:', error);
      });
    

    
    
  }
  async connectMetamask(): Promise<void> {
    const provider = await detectEthereumProvider();
    
    if (provider && provider.isMetaMask) {
      try {
        // Generate a unique nonce for each connection
      
      const timestamp = Date.now().toString();

      // Construct the message
      const message = `authentication=true&address=${this.ethereum.selectedAddress}&ts=${timestamp}`;

        
        const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
        this.tokenStorageService.saveIdWallet(accounts[0])

        const signature = await this.ethereum.request({
          method: 'personal_sign',
          params: [message, accounts[0]],
        });
  
        // Save the signature and address to local storage
        Cookies.set('metamaskSignature', signature, { secure: true, sameSite: 'Lax' });
        Cookies.set('metamaskAddress', accounts[0], { secure: true, sameSite: 'Lax' });
        Cookies.set('metamaskNonce', message, { secure: true, sameSite: 'Lax' });
        
        // Rest of your code
        await this.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        
        this.connect = true;
        this.isWalletConnected = true;
        this.tokenStorageService.setIsAuth('true')
      } catch (error) {
        console.error('Error connecting with MetaMask:', error);
        // Handle errors as needed
      }
    } else {
      // Handle the case where MetaMask is not available
      // throw new Error('Please install MetaMask!');
    }
  }

  async changeToBinance(provider: any) {
    const chainId = await this.ethereum.request({ method: 'eth_chainId' });
    if (chainId === env.chainIDDecimal || chainId === env.chainIDHex) {

    } else {
      (await (provider as any).request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: env.chainIDHex,
          chainName: env.chainName,
          nativeCurrency: {
            name: env.currencySymbol,
            symbol: env.currencySymbol,
            decimals: 18
          },
          rpcUrls: [env.rpcURL],
          blockExplorerUrls: [env.blockExplorerURL],
        }]
      }));
    }
  }




  async addTokenToBinance(provider: any) {
    const token = {
      type: 'ERC20',
      options: {
        address: env.sattContractAdress,
        symbol: 'SATT',
        decimals: 18,
        image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/7244.png',
      },
    };
    try {
      const accounts = await this.ethereum.request({ method: 'eth_accounts' });
      const tokenBalance = await this.getTokenBalance(token.options.address, accounts[0]);
      // console.log(tokenBalance)
      if (tokenBalance > 0) {
        // console.log('SATT already exists in wallet');
      } else {
        const added = await (provider as any).request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: token.options,
          },
        });
        if (added) {
          // console.log('SATT added to wallet');
        } else {
          // console.error('Failed to add SATT to wallet');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getTokenBalance(tokenAddress: string, account: string) {
    const web3 = new Web3(this.ethereum);
    const contract = new web3.eth.Contract(abi.SATT as any, tokenAddress);
    const balance = await (contract.methods.balanceOf as any)(account).call();
    return Number(balance) / 1e+18;
  }




  async checkChangedNetworkOrChainID() {
    if (this.isMetaMaskInstalled) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: any) => {
          console.log({chainId})
          if (this.isWalletConnected && chainId !== env.chainIDDecimal && chainId !== env.chainIDHex) {
            this.networkHasChanged = true;
          } else if (this.isWalletConnected && (chainId === env.chainIDDecimal || chainId === env.chainIDHex)) {
            this.networkHasChanged = false;
          }
        })
        .catch((err: any) => {
          console.error(err);
        });

      window.ethereum.on('chainChanged', (chainId: any) => {
        if (this.isWalletConnected && chainId !== env.chainIDDecimal && chainId !== env.chainIDHex) {
          this.networkHasChanged = true;
        } else if (this.isWalletConnected && (chainId === env.chainIDDecimal || chainId === env.chainIDHex)) {
          this.networkHasChanged = false;
        }
      });
    }
  }

  checkChangedAccounts() {
    if (this.isMetaMaskInstalled) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts: any) => {
          await this.handleAccountsChanged(accounts);
        })
        .catch((err: any) => {
          // console.error(err);
        });

      window.ethereum.on('accountsChanged', async (accounts: any) => {
        await this.handleAccountsChanged(accounts);
      });
    }
  }

  async handleAccountsChanged(accounts: string | any[]) {
    if (accounts.length === 0) {
      this.connect = false;
      this.isWalletConnected = false;
      this.acc = []
      this.tokenStorageService.setIsAuth('false')
    } else {
      this.isWalletConnected = true;
      this.acc = accounts;
      if (this.latest_acc !== this.acc[0]) {
        this.vp = await this.snapshotService.getVotingPower(this.acc[0].toString());
        this.latest_acc = this.acc[0];
      }
    }
    if ((accounts.length !== 0) && accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
    }
  }

  public checkConnectedWallet = async () => {
    const connectValue = this.tokenStorageService.getIsAuth();
    const provider = await detectEthereumProvider();
    if (connectValue !== null && connectValue === 'true') {
      this.connect = true;
      /*if (this.isWalletConnected) {
        await this.checkChangedNetworkOrChainID();
      }*/
      await this.checkChangedAccounts();
    } else {
      this.connect = false;
    }
    if (this.acc.length === 0) {
      this.connect = false;
      this.isWalletConnected = false;
    } else {
      this.isWalletConnected = true;
    }
    return this.acc;
  }


  async disconnectMetamask(): Promise<void> {
    // window.ethereum.on('disconnect', (error: any) => {
    //   console.log('Metamask disconnected:', error);
    // });
    this.connect = false;
    this.isWalletConnected = false;
    this.acc = [];
    this.tokenStorageService.setIsAuth('false')
  }
}