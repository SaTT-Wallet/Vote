import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Campaign } from '@app/models/campaign.model';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { WalletStoreService } from '@app/core/services/wallet-store.service';
import { ipfsURL } from '@app/config/atn.config';
import { VoteService } from '@app/core/services/vote/vote.service';
import { ExternalWalletService } from '@app/core/services/vote/external-wallet.service';
import { environment } from '@environments/environment';
import Cookies from 'js-cookie';
// TODO: missing budget property in the data sent by backend /v2/campaigns

@Component({
  selector: 'app-campaigns-list-item',
  templateUrl: './campaigns-list-item.component.html',
  styleUrls: ['./campaigns-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsListItemComponent implements OnInit {
  onDestroy$ = new Subject();
  ipfsURL: string = ipfsURL;
  @ViewChild('calculRoi', { static: false })
  private calculRoi!: TemplateRef<any>;
  @Input() campaign = new Campaign();
  @Output() deleted = new EventEmitter();
  @Input() newApplicant: any[]= [];
  newLink: boolean = false;
  showSpinner = false;
  deletebutton: boolean = false;
  picUserUpdated: boolean = false;
  @ViewChild('connectModal', { static: false })
  private connectModal!: TemplateRef<any>;
  public getScreenWidth: any;
  currencyName = '';
 
  private isDestroyed = new Subject();
  @HostListener('window:resize', ['$event'])

  resize(event: any) {
    
    this.getScreenWidth = event.target.innerWidth;
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private campaignsStore: CampaignsStoreService,
    private campaignListStoreService: CampaignsListStoreService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private tokenStorageService: TokenStorageService,
    private walletFacade: WalletFacadeService,
    private walletStoreService: WalletStoreService,
    private externalWalletService: ExternalWalletService,
    public voteService: VoteService,
    
  ) {}

  ngOnInit(): void {
   

    this.getScreenWidth = window.innerWidth;
this.getNewApplicant()
    this.currencyName = this.campaign.currency.name;
    if (this.currencyName === 'SATTBEP20') {
      this.currencyName = 'SATT';
    }
  }

  ngOnChanges() {
    this.getNewApplicant()
  }
getNewApplicant(){
  this.newApplicant.forEach((applicant: any)=>{
  if( applicant.idcampaign === this.campaign.id){
    this.newLink = applicant.newapplicant;
  }
   
    
  })
}

campaignByNetwork(campaign:any) {
  const network = Cookies.get('networkSelected');
  if(campaign.currency.type === network) return true;
  else return false;
}
connectMetaMask() {
  this.voteService.hideConnectDialog(this.connectModal);
  this.voteService.connectWallet('metamask')
}

sattConnect() {
  window.open(environment.domainName + '/auth/login', '_self')
}
truncateTitle(title: string): string {
  const maxLength = 17;
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...';
  }
  return title;
}
  async goToDetailsPage(id: string) {
    // const currentUrl = this.router.url;
    // if(this.deletebutton==false){
    //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     this.router.navigate(['/campaign'+this.campaign.id]);
    // });
    // }
    // this.router.navigate(["home/campaign", this.campaign.id])
    // .then(() => {
    //   window.location.reload();
    // })
    // this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
    //       this.router.navigate(['/campaign'+this.campaign.id]);
    //   });
    // window.location.reload();
    const res = await this.externalWalletService.checkConnectedWallet();
    if(res.length > 0) {
      if (this.deletebutton === false ) {
        this.router.navigate(['campaign', id]);
      } 
    } else {
      //this.modalService.open(this.connectModal);
      this.voteService.connectWallet('metamask');
    }
    
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
    // event.target.src =  this.user?.userPicture
  }
  caluculateRoi(id :any , event: any){
    event.stopPropagation();
    this.modalService.open(this.calculRoi);
    
  }

  goToEditPage(id: string) {
    this.router.navigate(['campaign', id, 'edit']);

  }

  convertUnixToDate(x: any) {
    return new Date(x * 1000);
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  deleteCampaign(id: any) {
    this.deletebutton = true;
    this.showSpinner = true;
    this.campaignsStore
      .removeDraftCampaign(id)
      .pipe(
        mergeMap(() => {
          this.deleted.emit(id);
          this.modalService.dismissAll();
          this.showSpinner = false;
          this.campaignListStoreService.getAllCampaigns(true, {});
          //     this.router
          //     .navigateByUrl('home/ad-pools');
          //   return this.translate.get('campaign_details.deleted');
          // }),
          // this.router
          //   .navigateByUrl('', { skipLocationChange: true })
          //   .then(() => {
          //     this.router.navigate(['home/ad-pools']);
          //   });
            window.location.reload();
         
          return this.translate.get('campaign_details.deleted');
        })
      )
      .subscribe((data1: any) => {
        this.campaignListStoreService.clearStore();
        this.campaignListStoreService.loadCampaigns();
        this.toastr.success(data1);
      });
  }

  get isFacebookSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'facebook');
  }
  get isYoutubeSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'youtube');
  }
  get isInstagramSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'instagram');
  }
  get isTwitterSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'twitter');
  }

  get isLinkedinSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'linkedin');
  }
  get isTikTokSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'tiktok');
  }

  get isThreadsSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'threads');
  }
  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }
  get isNewCampaign(): boolean {
    let start = new Date(this.campaign.startDate);

  
    let today = new Date();

    if (
      start.setDate(start.getDate()) >=
      today.setHours(0, 0, 0, 0)
    ) {
      return true;
    } else return false;
  }
  get isPerformance(): boolean {
    if (this.campaign.remuneration === 'performance') {
      return true;
    } else return false;
  }
  get isPublication(): boolean {
    if (this.campaign.remuneration === 'publication') {
      return true;
    } else return false;
  }
  closeRoi($event: any){
  
    
    if ($event){
      this.closeModal(this.calculRoi)
    }

  }
  getCurrencyName(campaign: any) {
    const currencyName = campaign.currency.name;
    if (currencyName === ' SATTBEP20') {
      return 'SATT';
    }
    return currencyName;
  }
  ngOnDestroy(): void {
    // this.isDestroyed.next('');
    // this.isDestroyed.unsubscribe();
  }
}
