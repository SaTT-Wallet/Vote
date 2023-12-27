import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { catchError, map, share } from 'rxjs/operators';
import { Observable, Subject,from,of, throwError } from 'rxjs';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IResponseWallet } from '@app/core/iresponse-wallet';
import {
  IApiResponse,
  ITransferTokensResponse
} from '@app/core/types/rest-api-responses';
import Web3 from 'web3';
import { environment } from '@environments/environment.prod';

export interface ITransferTokensRequestBody {
  from: string;
  to: string;
  amount: string;
  pass: string;
  network: string;
  tokenSymbol: string;
  tokenAddress: string;
}

type NetworkToTokenStandard = {
  [key: string]: string;
};

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: any;

  private idWalletSubject = new Subject<string>();
  idWallet$ = this.idWalletSubject.asObservable();
  
  networkToTokenStandard: NetworkToTokenStandard = {
    "Ethereum": "erc20",
    "BNB Smart Chain (BEP20)": "bep20",
    "Polygon": "polygon",
    "Tron20": "tron",
    "BTTC": "bttc",
  };


  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  dismissPage = new Subject();

  public getWallet(): Observable<IResponseWallet> {
    return this.http.post<IResponseWallet>(sattUrl + '/wallet/mywallet', {
      version: this.tokenStorageService?.getWalletVersion()
    });
  }


  updateWalletId(walletId: string) {
    this.idWalletSubject.next(walletId);
  }

  
  public getAllWallet(): Observable<IResponseWallet> {
const walletData: string = this.tokenStorageService.getIdWallet();

const responseWallet: IResponseWallet = {
  code: 200, 
  data: {
    address: walletData,
    bnb_balance: "0",
    btc_balance: 0,
    ether_balance: "0",
    satt_balance: "0",
    tronAddress: "",
    version: 1,
    err: "",
    totalBalance: "0",
  },
};

return of(responseWallet);
  }

  transferTokens(
    body: ITransferTokensRequestBody,
    max: any
  ): Observable<IApiResponse<ITransferTokensResponse>> {
    return this.http.post<IApiResponse<ITransferTokensResponse>>(
      `${sattUrl}/wallet/transferTokens?max=${max}`,
      body
    );
  }

  createTronWallet(password: string) {
    return this.http.post(`${sattUrl}/wallet/add-tron-wallet`, {
      pass: password
    });
  }

  checkUserWalletV2() {
    return this.http.get(`${sattUrl}/wallet/checkUserWalletV2`);
  }

  
  getBalanceByToken(payload: any): Observable<any> {
    const { network, walletAddress, smartContract } = payload;

    const getWeb3Url = (networkName: string): string => {
      switch (networkName.toLowerCase()) {
        case 'bnb smart chain':
        case 'bep20':
          return environment.WEB3_URL_BEP20;
        case 'ethereum':
        case 'erc20':
          return environment.WEB3_URL;
        case 'polygon':
        case 'polygon':
          return environment.WEB3_URL_POLYGON;
        case 'bttc':
        case 'bittorrent':
          return environment.WEB3_URL_BTT;
        default:
          return '';
      }
    };

    const web3Url = getWeb3Url(network);

    if (!web3Url) {
      console.error('Unsupported network:', network);
      return throwError({
        code: 500,
        message: 'error',
        data: null,
      });
    }

    this.web3 = new Web3(new Web3.providers.HttpProvider(web3Url));

    const data = this.web3.eth.abi.encodeFunctionSignature('balanceOf(address)') +
                 this.web3.eth.abi.encodeParameters(['address'], [walletAddress]).slice(2);

    return from(this.web3.eth.call({
      to: smartContract,
      data: data,
    })).pipe(
      map((rawBalance: any) => {
        const balanceHex = this.web3.utils.isHexStrict(rawBalance) ? rawBalance : '0x0';
        
        if (balanceHex === '0x' || balanceHex === '0x0') {
          return {
            code: 200,
            message: 'success',
            data: 0,
          };
        }

        const balanceDecimal = this.web3.utils.hexToNumberString(balanceHex);
        return {
          code: 200,
          message: 'success',
          data: Number(balanceDecimal),
        };
      }),
      catchError((error: any) => {
        console.error('Error getting balance:', error);
        return throwError({
          code: 500,
          message: 'error',
          data: null,
        });
      })
    );
}


  createNewWalletV2(password: string) {
    return this.http.post(`${sattUrl}/wallet/create/v2`, { pass: password });
  }

  verifySign(password: string) {
    return this.http.post(`${sattUrl}/wallet/verifySign`, { pass: password });
  }

  checkUserIsNew() {
    return this.http.get(`${sattUrl}/wallet/checkIsNewUser`);
  }

  checkWalletV2Exist() {
    return this.http.get(`${sattUrl}/wallet/checkUserWalletV2`);
  }

  chartjs() {
    /*
     @Url :API (link) /balance/stats'
     @description: fetch user chart stats
	 @parameters : header access token
     @response : object of arrays => different balance stats (daily, weekly, monthly)
     */
    return this.http.get(sattUrl + '/wallet/stats');
  }

  checkToken(network: string, tokenAdress: any) {
    return this.http.post(`${sattUrl}/wallet/checkWalletToken`, {
      network: network,
      tokenAdress: tokenAdress
    });
  }
  addToken(
    tokenName: string,
    symbol: string,
    decimal: string,
    tokenAdress: string,
    network: string
  ) {
    network = this.networkToTokenStandard[network] || network;

    return this.http.post(`${sattUrl}/wallet/addNewToken`, {
      tokenAdress,
      decimal,
      symbol,
      network,
      tokenName
    });
  }
  listTokens() {
    return this.http.get(sattUrl + '/wallet/cryptoDetails');
    // https://api.satt-token.com:3014/prices
  }

  getExportCode(network: string, version: string) {
    return this.http.post(`${sattUrl}/wallet/code-export-keystore`, {
      network: network,
      version: version
    });
  }

  exportKeyStore(network: string, version: string, code: number) {
    return this.http.post(`${sattUrl}/wallet/export-keystore`, {
      network: network,
      version: version,
      code: code
    });
  }

  verifyUserToken() {
    return this.http.get(`${sattUrl}/external/verify-token`);
  }
}
