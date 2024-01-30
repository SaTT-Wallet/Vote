import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { Campaign } from '@app/models/campaign.model';
import { Page } from '@app/models/page.model';
import { User } from '@app/models/User';
import _, { concat } from 'lodash';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  first,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
import introJs from 'intro.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { Big } from 'big.js';
import { environment } from '@environments/environment';
import { ProfileService } from '@app/core/services/profile/profile.service';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { DraftCampaignStoreService } from '@app/core/services/draft-campaign-store.service';
import { AuthStoreService } from '@app/core/services/Auth/auth-store.service';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { ConvertFromWei } from '@app/shared/pipes/wei-to-sa-tt.pipe';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import Cookies from 'js-cookie';
import { ExternalWalletService } from '@app/core/services/vote/external-wallet.service';
import { VoteService } from '@app/core/services/vote/vote.service';
@Component({
  selector: 'app-ad-pools',
  templateUrl: './ad-pools.component.html',
  styleUrls: ['./ad-pools.component.scss']
})
export class AdPoolsComponent implements OnInit, OnDestroy {
  campaignsList: Campaign[] = [];
  campaignsList2: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  show: boolean = true;
  picUserUpdated: boolean = false;
  user!: User;
  subscription: Subscription | undefined;
  isLoading = true;
  introJS = introJs();
  intro1: string = '';
  intro2: string = '';
  intro3: string = '';
  intro4: string = '';
  campaignsOwnesByUser: string[] =[""];
  lastLogin: any;
  newApplicant: any[]= [{}];
  // intro5: string = "";
  button: string = '';
  showModal = false;
  @ViewChild('welcomeModal', { static: false })
  public welcomeModal!: TemplateRef<any>;

  totalBudgetInvested$ = this.campaignService.getTotalInvestetd().pipe(
    catchError(() => {
      return of('0');
    }),
    map((r: any) => this.showNumbersRule.transform(r.data.totalInvested))
  );

  totalBudgetInvestedInUSD$ = this.campaignService.getTotalInvestetd().pipe(
    catchError(() => {
      return of('0');
    }),
    map((r: any) => this.showNumbersRule.transform(r.data.totalInvestedUSD))
  );

  idcamp: any;
  isFormatGrid = true;
  percentProfil: any;
  isChecked = false;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  cryptoPrices: any;
  constructor(
    private accountFacadeService: AccountFacadeService,
    private campaignsListStoreService: CampaignsListStoreService,
    private campaignService: CampaignHttpApiService,
    private draftStore: DraftCampaignStoreService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private authStoreService: AuthStoreService,
    public tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private profileService: ProfileService,
    public translate: TranslateService,
    public modalService: NgbModal,
    private convertFromWeiTo: ConvertFromWei,
    private walletFacade: WalletFacadeService,
    private showNumbersRule: ShowNumbersRule,
    public externalWalletService: ExternalWalletService,
    private voteService: VoteService,
  ) {}

  ngOnInit(): void {
   
    this.onBoarding();
    this.loadCampaigns();
    
  }
 
  campare(a:any,b:any) {
    if(a.createdAt > b.createdAt) return 1;
    if(a.createdAt < b.createdAt) return -1;
    return 0;
  }


  findDuplicatesCampaigns(arr: any) {
    let unique:any = [];
    arr.forEach((element:any) => {
        if (!unique.includes(element.id)) {
            unique.push(element);
        }
    });
    return unique;
  }

  getUserPic() {

  }


  onScroll() {
    this.campaignsListStoreService.emitPageScroll();
  }

  createNewDraftCampaign() {
    //this.draftStore.init();
    if(this.externalWalletService.isWalletConnected &&
    this.externalWalletService.connect) {
      this.draftStore
      .addNewDraft(new Campaign())
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((draft: Campaign) => {
        this.idcamp = draft.id || '';
        this.router.navigate(['campaign', this.idcamp, 'edit']);
      });
    } else {
      this.voteService.connectWallet('metamask')
    }
    
  }
  sortList(array: any) {
    let list = [
      ...array.filter((data: Campaign) => data.isDraft),
      ...array.filter(
        (data: Campaign) => data.isOwnedByUser && !data.isFinished
      ),
      ...array.filter((data: Campaign) => data.proms && data.isFinished),
      ...array.filter((data: Campaign) => data.proms && !data.isFinished),
      ...array.filter(
        (data: Campaign) =>
          !data.isDraft && !data.isOwnedByUser && !data.isFinished
      ),
      ...array.filter((data: Campaign) => data.isFinished)
    ];

    return [...new Set(list)];
  }

  loadCampaigns() {
    this.campaignsListStoreService.loadingCampaign$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((res) => {
        
        if (res) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      });
    if (this.tokenStorageService.getToken()) {
      this.getUserPic();
    } else {
      // TODO: load campaigns list here
      // this.campaignsListStoreService.list$
      //   .pipe(filter((data) => data[0].size !== 0))
      //   .pipe(
      //     map((pages: Page<Campaign>[]) => {
      //       this.isLoading = false;
      //       return _.flatten(pages.map((page: Page<Campaign>) => page.items));
      //     }),
      //     takeUntil(this.onDestoy$)
      //   )
      this.walletFacade
        .getCryptoPriceList()
        .pipe(
          filter((res) => {
            return res !== null;
          }),
          map((res: any) => res.data),
          tap((cryptoPrices) => (this.cryptoPrices = cryptoPrices)),
          mergeMap(() => {
            return this.campaignsListStoreService.list$.pipe(
              map((pages: Page<Campaign>[]) =>
                _.flatten(pages.map((page: Page<Campaign>) => page.items))
              )
            );
          }),
          takeUntil(this.onDestoy$)
        )
        .subscribe(
          (campaigns: Campaign[]) => {
            if (campaigns.length === 0) {
              this.isLoading = false;
            }
            //const selectedNetwork = Cookies.get('networkSelected')?.includes('BNB')  ? 'bep20' : (Cookies.get('networkSelected') === 'Ethereum' ? 'erc20' : (Cookies.get('networkSelected') === 'BitTorrent' ? 'bttc' : 'polygon'))
            //const isMatchingNetwork = (campaign: any) => campaign.currency.type.toString().toLowerCase() === selectedNetwork;
            this.campaignsList = campaigns;
            this.campaignsList2 = [...this.campaignsList];
            this.campaignsList?.forEach((element: Campaign) => {
              if (element.currency.name === 'SATTPOLYGON')
                element.currency.name = 'MATIC';
              if (element.currency.name === 'SATTBEP20')
                element.currency.name = 'SATT';
              if (this.cryptoPrices) {
                element.budgetUsd = new Big(
                  this.cryptoPrices[element.currency.name].price + ''
                )
                  .times(
                    this.convertFromWeiTo.transform(
                      element.budget,
                      element.currency.name,
                      2
                    )
                  )
                  .toFixed(2);
              }
            });
            this.campaignsListStoreService.emitPageScroll();
            this.filteredCampaigns = this.campaignsList
            // this.campaignsList = campaigns.filter(
            //   (campaign: Campaign) => campaign.isDraft === false
            // );
          },
          () => {
            this.isLoading = false;
          }
        );
    }
    /*this.campaignService.loadDataAddPoolWhenEndScroll
      .pipe(debounceTime(50), takeUntil(this.onDestoy$))
      .subscribe(() => {
        this.campaignsListStoreService.emitPageScroll();
      });*/

    //this.campaignsListStoreService.loadNextPage({}, true);
  }
  filterCampaigns(): Campaign[] {
    const selectedNetwork =(!!Cookies.get('networkSelected') ? (Cookies.get('networkSelected')?.includes('BNB')  ? 'bep20' : (Cookies.get('networkSelected') === 'Ethereum' ? 'erc20' : (Cookies.get('networkSelected') === 'BitTorrent' ? 'bttc' : ( Cookies.get('networkSelected') === 'Arthera' ? 'arthera':'polygon')))) :'bep20') 
    this.filteredCampaigns = this.campaignsList.filter(
      (campaign) => campaign.currency.type.toLowerCase() === selectedNetwork
    );
    return this.filteredCampaigns;
  }
  ngOnDestroy(): void {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
    this.subscription?.unsubscribe();
  }

  listenForStyleHost($event: any) {
    this.isFormatGrid = $event;
  }

  filterCampaignsBySelectedCryptos(cryptoList: any[]) {
    if (cryptoList.length > 0) {
      this.campaignsList = this.campaignsList2.filter(
        (campaign) => cryptoList.indexOf(campaign.currency.name) >= 0
      );
    } else {
      this.campaignsList = this.campaignsList2;
    }
  }

  private onBoarding() {

  }

  private startSteps() {
    let arrayOfObs = [];
    arrayOfObs.push(this.translate.get('onBoarding.introo'));
    arrayOfObs.push(this.translate.get('onBoarding.intro2'));
    arrayOfObs.push(this.translate.get('onBoarding.intro3'));
    arrayOfObs.push(this.translate.get('onBoarding.intro4'));
    arrayOfObs.push(this.translate.get('onBoarding.intro5'));
    arrayOfObs.push(this.translate.get('onBoarding.next'));
    forkJoin(arrayOfObs).subscribe((resArray: any[]) => {
      this.intro1 = resArray[0];
      this.intro2 = resArray[1];
      this.intro3 = resArray[2];
      this.intro4 = resArray[3];
      this.button = resArray[5];
      this.introJS
        .setOptions({
          tooltipClass: 'customTooltip ',
          nextLabel: '',
          prevLabel: '',
          doneLabel: '',
          hidePrev: true,
          showBullets: false,
          exitOnOverlayClick: false,
          scrollToElement: true,

          steps: [
            {
              element: '#introo',
              intro: this.intro1,
              position: 'bottom'
            },
            {
              element: '#intro2',
              intro: this.intro2,
              position: 'bottom'
            },
            {
              element: '#intro3',
              intro: this.intro3,
              position: 'bottom'
            },
            {
              element: '#intro4',
              intro: this.intro4,
              position: 'bottom'
            }

            // {
            //   element: "#intro5",
            //   intro: this.intro5,
            //   position: "bottom",
            // },
          ]
        })
        .start()
        .onexit(() => {
          this.authService
            .onBoarding()
            .pipe(
              tap((res: any) => {
                if (!!res.success) {
                  this.authStoreService.setAccount({
                    ...this.authStoreService.account,
                    onBoarding: true
                  });
                  this.accountFacadeService.dispatchUpdatedAccount();
                }
              }),
              takeUntil(this.onDestoy$)
            )
            .subscribe(() => {
              this.showModal = !this.showModal;
              this.getDetails();
            });
        });
    });
  }

  private getDetails() {

  }

  private openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  onImgError(event: any) {
    event.target.src = 'assets/Images/wlcm-moon-boy.png';
  }
  goToProfile(modal: any) {
    this.closeModal(modal);
    this.router.navigate(['home/settings/edit']);
  }

  dontShowAgain() {
    this.isChecked = !this.isChecked;
    if (this.isChecked === true) {
      let data_profile = {
        toggle: false
      };
      this.profileSettingsFacade
        .updateProfile(data_profile)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe();
      this.tokenStorageService.setShowPopUp('false');
    }

    if (this.isChecked === false) {
      let data_profile = {
        toggle: true
      };
      this.profileSettingsFacade
        .updateProfile(data_profile)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe();
      this.tokenStorageService.setShowPopUp('true');
    }
  }
  trackByCampaignId(index: number, campaign: Campaign): string {
    return campaign.id;
  }
}
