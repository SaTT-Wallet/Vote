import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth.service';
import { filter, tap } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { CryptofetchServiceService } from '../wallet/cryptofetch-service.service';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  constructor(
    private auth: AuthService,
    private tokenStorageService: TokenStorageService,
    private cryptofetchServiceService: CryptofetchServiceService,
    private walletFacade: WalletFacadeService,
  ) {}

  private _account: BehaviorSubject<any> = new BehaviorSubject(null);
  readonly account$ = this._account
    .asObservable()
    .pipe(filter((account) => account !== null));

  get account() {
    return this._account.getValue();
  }

  public setAccount(account: any) {
    this._account.next(account);
  }
  /*async getWalletAddress() {
    this.walletFacade
          .getAllWallet()
          .subscribe((data: any) => {
            if(data.message === "success") {
              if (this.tokenStorageService.getWalletVersion() === 'v2') {
                this.tokenStorageService.saveIdWallet(data.data.addressV2);
                this.tokenStorageService.saveTronWallet(data.data.tronAddressV2);
                this.tokenStorageService.saveWalletBtc(data.data.btcAddressV2);
              } else {
                this.tokenStorageService.saveIdWallet(data.data.address);
                this.tokenStorageService.saveTronWallet(data.data.tronAddress);
                this.tokenStorageService.saveWalletBtc(data.data.btcAddress);
               
               
              }
  
            } 
          }, (err:any) => {
            console.error(err)
          });
  }*/
 

  public getAccount() {
    this.setAccount(this.tokenStorageService.getIdWallet());
    
  }

  clearStore() {
    this.setAccount(null);
  }
}
