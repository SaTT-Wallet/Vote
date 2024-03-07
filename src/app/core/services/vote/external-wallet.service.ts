import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';
import { environment as env } from '../../../../environments/environment.prod';
import { abi } from '../../../../environments/abi';
import Cookies from 'js-cookie';
import { SnapshotService } from '@app/vote/snapshot.service';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { CookieService } from 'ngx-cookie-service';
declare let window: any;

@Injectable({
  providedIn: 'root',
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

  constructor(
    private snapshotService: SnapshotService,
    private tokenStorageService: TokenStorageService,
    private cookieService: CookieService
  ) {
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

  async connectMetamask(): Promise<void> {
    const provider = await detectEthereumProvider();

    if (provider && provider.isMetaMask) {
      try {
        // Generate a unique nonce for each connection

        

        // Construct the message
        
        const accounts = await this.ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.tokenStorageService.saveIdWallet(accounts[0]);
       
        // Save the signature and address to local storage
        

        // Rest of your code
        await this.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        await this.changeToBinance(provider);
       
        this.connect = true;
        this.isWalletConnected = true;
        this.tokenStorageService.setIsAuth('true');
      } catch (error) {
        console.error('Error connecting with MetaMask:', error);
        // Handle errors as needed
      }
    } else {
      // Handle the case where MetaMask is not available
      // throw new Error('Please install MetaMask!');
    }
  }

  async changeNetwork(provider: any, network: any) {
    await (provider as any).request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId:
            network === 'bsc'
              ? env.bnbNetwork.chainIDHex
              : network === 'erc20'
              ? env.mainnetNetwork.chainIDHex
              : network === 'bscT'
              ? env.testNetNetwork.chainIDHex
              : network === 'polygon'
              ? env.polygonNetwork.chainIDHex
              : network === 'arthera' 
              ? env.artheraNetwork.chainIDHex
              : env.bttNetwork.chainIDHex,
          chainName:
            network === 'bsc'
              ? env.bnbNetwork.chainName
              : network === 'erc20'
              ? env.mainnetNetwork.chainName
              : network === 'bscT'
              ? env.testNetNetwork.chainName
              : network === 'polygon'
              ? env.polygonNetwork.chainName
              : network === 'arthera'
              ? env.artheraNetwork.chainName 
              : env.bttNetwork.chainName,
          nativeCurrency: {
            name:
              network === 'bsc'
                ? env.bnbNetwork.currencySymbol
                : network === 'erc20'
                ? env.mainnetNetwork.currencySymbol
                : network === 'bscT'
                ? env.testNetNetwork.currencySymbol
                : network === 'polygon'
                ? env.polygonNetwork.currencySymbol
                : network === 'arthera'
                ? env.artheraNetwork.currencySymbol
                : env.bttNetwork.currencySymbol,
            symbol:
              network === 'bsc'
                ? env.bnbNetwork.currencySymbol
                : network === 'erc20'
                ? env.mainnetNetwork.currencySymbol
                : network === 'bscT'
                ? env.testNetNetwork.currencySymbol
                : network === 'polygon'
                ? env.polygonNetwork.currencySymbol
                : network === 'arthera'
                ? env.artheraNetwork.currencySymbol
                : env.bttNetwork.currencySymbol,
            decimals: 18,
          },
          rpcUrls: [
            network === 'bsc'
              ? env.bnbNetwork.rpcURL
              : network === 'erc20'
              ? env.mainnetNetwork.rpcURL
              : network === 'bscT'
              ? env.testNetNetwork.rpcURL
              : network === 'polygon'
              ? env.polygonNetwork.rpcURL
              : network === 'arthera'
              ? env.artheraNetwork.rpcURL
              : env.bttNetwork.rpcURL,
          ],
          blockExplorerUrls: [
            network === 'bsc'
              ? env.bnbNetwork.blockExplorerURL
              : network === 'erc20'
              ? env.mainnetNetwork.blockExplorerURL
              : network === 'bscT'
              ? env.testNetNetwork.blockExplorerURL
              : network === 'polygon'
              ? env.polygonNetwork.blockExplorerURL
              : network === 'arthera'
              ? env.artheraNetwork.blockExplorerURL
              : env.bttNetwork.blockExplorerURL,
          ],
        },
      ],
    });
  }

  
  async changeToBinance(provider: any) {
    const chainId = await this.ethereum.request({ method: 'eth_chainId' });

    switch (chainId) {
        case env.testNetNetwork.chainIDHex:
            await this.addChain(provider, env.testNetNetwork);
            break;
        case env.bnbNetwork.chainIDHex:
            await this.addChain(provider, env.bnbNetwork);
            break;
        case env.polygonNetwork.chainIDHex:
            await this.addChain(provider, env.polygonNetwork);
            break;
        case env.bttNetwork.chainIDHex:
            await this.addChain(provider, env.bttNetwork);
            break;
        // Add more cases as needed
        default:
            console.error('Unsupported chain ID:', chainId);
            break;
    }
}

private async addChain(provider: any, network: any) {
    await (provider as any).request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: network.chainIDHex,
                chainName: network.chainName,
                nativeCurrency: {
                    name: network.currencySymbol,
                    symbol: network.currencySymbol,
                    decimals: 18,
                },
                rpcUrls: [network.rpcURL],
                blockExplorerUrls: [network.blockExplorerURL],
            },
        ],
    });
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
      const tokenBalance = await this.getTokenBalance(
        token.options.address,
        accounts[0]
      );
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
    return Number(balance) / 1e18;
  }

  async checkChangedNetworkOrChainID() {
    if (this.isMetaMaskInstalled) {
      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId: any) => {
          if (
            this.isWalletConnected &&
            chainId !== env.chainIDDecimal &&
            chainId !== env.chainIDHex
          ) {
            this.networkHasChanged = true;
          } else if (
            this.isWalletConnected &&
            (chainId === env.chainIDDecimal || chainId === env.chainIDHex)
          ) {
            this.networkHasChanged = false;
          }
        })
        .catch((err: any) => {
          console.error(err);
        });

      window.ethereum.on('chainChanged', (chainId: any) => {
        if (
          this.isWalletConnected &&
          chainId !== env.chainIDDecimal &&
          chainId !== env.chainIDHex
        ) {
          this.networkHasChanged = true;
        } else if (
          this.isWalletConnected &&
          (chainId === env.chainIDDecimal || chainId === env.chainIDHex)
        ) {
          this.networkHasChanged = false;
        }
      });
    }
  }

  checkChangedAccounts() {
    if (this.isMetaMaskInstalled) {
      window.ethereum
        .request({ method: 'eth_accounts' })
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
      this.acc = [];
      this.tokenStorageService.setIsAuth('false');
    } else {
      this.isWalletConnected = true;
      this.acc = accounts;
      if (this.latest_acc !== this.acc[0]) {

        /*this.vp = await this.snapshotService.getVotingPower(
          this.acc[0].toString()
        );*/

        this.latest_acc = this.acc[0];
      }
    }
    if (accounts.length !== 0 && accounts[0] !== this.currentAccount) {
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
  };

  async disconnectMetamask(): Promise<void> {
    // window.ethereum.on('disconnect', (error: any) => {
    //   console.log('Metamask disconnected:', error);
    // });
    this.cookieService.delete('UserId');
    this.cookieService.delete('jwt');
    this.cookieService.delete('metamaskAddress');
    this.connect = false;
    this.isWalletConnected = false;
    this.acc = [];
    this.tokenStorageService.setIsAuth('false');
  }
}
