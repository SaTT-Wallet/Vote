/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  Renderer2,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  Input,
  TemplateRef
} from '@angular/core';
// import { bscan, etherscan } from '@app/config/atn.config';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
// import { NotificationService } from '@core/services/notification/notification.service';
// import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';


// import { walletUrl, ListTokens } from '@config/atn.config';
// import { User } from '@app/models/User';
import { SidebarService } from 'src/app/core/services/sidebar/sidebar.service';
import { Clipboard } from '@angular/cdk/clipboard';
// import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { BehaviorSubject, of, Subject, Subscription, timer } from 'rxjs';
// import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
// import { ToastrService } from 'ngx-toastr';
import { Web3Provider } from '@ethersproject/providers';
import {
  concatMap,
  filter,
  map,
  mapTo,
  mergeMap,
  takeUntil,
  tap,
  startWith
} from 'rxjs/operators';
// import { WalletFacadeService } from '@core/facades/wallet-facade.service';
// import { AuthStoreService } from '@core/services/Auth/auth-store.service';
// import { WalletService } from '@app/core/services/wallet/wallet.service';
import { environment as env } from './../../../../environments/environment.prod';
// import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
// import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
// import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// import { IApiResponse } from '@app/core/types/rest-api-responses';
// import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
import { ReturnStatement } from '@angular/compiler';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { REPL_MODE_STRICT } from 'repl';
import { ExternalWalletService } from 'src/app/core/services/vote/external-wallet.service';
import { VoteService } from 'src/app/core/services/vote/vote.service';
import Cookies from 'js-cookie';

const bscan = env.bscanaddr;
const etherscan = env.etherscanaddr;
const tronScanAddr = env.tronScanAddr;
const tronScan = env.tronScan;
const polygonscanAddr = env.polygonscanAddr;
const btcScanAddr = 'https://www.blockchain.com/btc/address/';
const bttscanAddr = env.bttscanAddr;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  blockExplorerURL = env.blockExplorerURL;
  currentScreenSize: string | undefined;
  public connectModal!: TemplateRef<any>;
  query = '(max-width: 991.98px)';
  mediaQueryList?: MediaQueryList;
  query2 = '(width =   767.9px)';
  mediaQueryList2?: MediaQueryList;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  clicked: boolean = true;
  @ViewChild('myprofile') myprofile?: ElementRef;
  bnbGaz: any;
  ethGaz: any;
  languageSelected: any;
  dataNotification: any[] = [];
  // user!: User;
  isClickedOutside: boolean = true;
  showMore: boolean = false;
  showWallet: boolean = false;
  showMenuNotif: boolean = false;
  showMenuProfil: boolean = false;
  isTransactionHashCopiedtron = false;
  public walletConnected!: boolean;
  public walletId: string = '';
  web3 !: Web3Provider;
  isNotInstalled: boolean = false;
  isPopupVisible: boolean = false;
  provider!: any;
  account!: string[];
  formattedCreator: string | undefined;
  existV2: any;

  isDropdownOpen: boolean = true;
  tronAddress: string = '';

  copyMsg: boolean = false;
  copyMsg1: boolean = false;
  isBitcoinAdress: boolean = false;

  clickedElement: Subscription = new Subscription();
  bnb: any;
  eth: any;
  gazsend: any;
  erc20Gaz: any;
  bepGaz: any;
  networkLabel: any = "BNB Smart chain";
  networkLogo: any = "bsc"
  networkList: any[] = [];
  showNetwork: any = false;
  showNotifications: boolean = false;
  newNotification: boolean = false;
  isSeen: number = 0;
  btcCode: string = '';
  btcCodeV2: string = '';
  erc20: string = '';
  portfeuilleList: Array<{ type: any; code: any }> = [];
  generateCode: boolean = false;
  isDisplay1: boolean = false;
  isDisplay2: boolean = false;
  isDisplay3: boolean = false;
  isDisplay4: boolean = false;
  notif: any;
  url1: any;
  url2: any;
  url3: any;
  urlM1: any;
  urlM2: any;
  urlM4: any;
  urlM5: any;
  url4: any;
  url5: any;
  url6: any;



  picUserUpdated: boolean = false;
  oldHeight: any;
  newHeight: any;
  public getScreenWidth: any;
  public getScreenHeight: any;
  seen: boolean = false;
  menuAdpool: boolean = false;
  menuFarmPost: boolean = false;
  menuHistory: boolean = false;
  menuHelp: boolean = false;
  menuAbout: boolean = false;
  menuBlog: boolean = false;
  menuWallet: boolean = false;
  menuCampaign: boolean = false;
  menuTokenInfo: boolean = false;
  menuBuyToken: boolean = false;

  // successPart: boolean = false;
  // errorPart: boolean = false;
  sucess: any = false;

  @ViewChild('qrbtnERCM', { static: false }) qrbtnERCM?: ElementRef;
  @ViewChild('header', { static: false }) header?: ElementRef;
  @ViewChild('headerNav') headerNav?: ElementRef;

  // allnotification: BehaviorSubject<Array<any>> = new BehaviorSubject([null]);
  message: any;

  isPlatformBrowser = isPlatformBrowser(this.platformId);

  // elementType = NgxQrcodeElementTypes.URL;
  // correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  // value = 'Techiediaries';
  @Input() phishingClosing: boolean = false;
  issendfire: number = 0;
  private notifItemSize = 111;
  notifListSize = 0;
  isConnected: boolean = false;
  isWelcomePage = false;
  defaultHeaderBackground =
    'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%);';

  private resized = false;
  menuSendRecieve: boolean = false;
  private isDestroyed$ = new Subject();
  isTransactionHashCopied = false;
  isTransactionHashCopiedbtc = false;
  isLayoutDesktop = false;
  erc20V2: any;
  tronAddressV2: any;
  displayNew: any;
  displayOld: any;
  title: any = '';
  titleWallet: any = '';
  existV1: any;
  @HostListener('window:resize', ['$event'])

  resize(event: any) {
    this.getScreenHeight = event.target.innerHeight;
    this.getScreenWidth = event.target.innerWidth;
  }

  // goToVote() {
  //   this.router.navigate(['/vote']);
  // }

  constructor(
    breakpointObserver: BreakpointObserver,
    public externalWalletService: ExternalWalletService,
    public voteService: VoteService,
    public router: Router,
    public sidebarService: SidebarService,
    private eRef: ElementRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private clipboard: Clipboard,
    // private toastr: ToastrService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private route: ActivatedRoute,
    private hostElement: ElementRef
  ) {
    breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((result) => {
        this.isLayoutDesktop = result.matches;

        // for (const query of Object.keys(result.breakpoints)) {
        //   if (result.breakpoints[query]) {
        //     result.matches;
        //     console.log(result.matches,'-----------');

        //   }

        // }
      });

    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia(this.query);
      this.mediaQueryList2 = window.matchMedia(this.query2);

      window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        this.document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }


    // translate.onLangChange
    //   .pipe(takeUntil(this.isDestroyed$))
    //   .subscribe((event: LangChangeEvent) => {
    //     this.languageSelected = event.lang;
    //     this._changeDetectorRef.detectChanges();
    //     this.translate.use(this.languageSelected);
    //     this.getNotifications();
    //   });
    // this.isWelcomePage = this.router.url.includes('welcome');

    //detect url changes to change the background of header
    this.router.events.pipe(takeUntil(this.isDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('welcome')) {
          this.isWelcomePage = true;
        } else {
          this.isWelcomePage = false;
        }

        if (
          event.url.includes('campaign') ||
          event.url === '/home'
        ) {
          this.menuCampaign = true;
        } else {
          this.menuCampaign = false;
        }

        // if (event.url.includes('errorMessage')) {
        //   this.errorPart = true;
        // } else {
        //   this.errorPart = false;
        // }
        // if (event.url.includes('successMessage')) {
        //   this.successPart = true;
        // } else {
        //   this.successPart = false;
        // }
        if (this.router.url.includes('welcome')) {
          this.checkMenuAdpool();
        }
        if (
          this.router.url.includes('buy-token') ||
          this.router.url.includes('edit')
        ) {
          //@ts-ignore
          // this.header?.nativeElement.style.background =
          //   'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)';
          this.renderer.setStyle(
            this.header?.nativeElement,
            'background',
            'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)'
          );
          this.isWelcomePage = false;
          this.menuBuyToken = true;
        }
        // if (!this.isWelcomePage) {
        //   this.renderer.setStyle(
        //     this.header?.nativeElement,
        //     'background',
        //     'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)'
        //   );
        // }
      }
    });
  }
  ngAfterViewInit(): void {
    // if(this.route.url)
    this.route.url.subscribe((e) => { });
    this.router.events
      .pipe(
        tap((e) => { }),
        filter((e: any) => e instanceof NavigationEnd),
        startWith({ url: this.router.url })
      )
      .subscribe((e: any) => { });
  }



  toggleNetworkList() {
    this.showNetwork = !this.showNetwork;
  }

  displayNetwork(e: any){
    this.networkLabel = e.network;
    this.networkLogo = e.label;
    Cookies.set('networkSelected', this.networkLabel ,  { secure: true, sameSite: 'Lax' });
    Cookies.set('networkSelectedLogo', this.networkLogo ,  { secure: true, sameSite: 'Lax' });
  }

  controllingNetwork(){
    try {
      this.networkLabel = Cookies.get('networkSelected') || 'BNB smart chain';
      this.networkLogo = Cookies.get('networkSelectedLogo') || 'bsc'
    } catch (error) {
      console.error('Error retrieving or setting cookie:', error);
      this.networkLabel = 'bnb smart chain';
      this.networkLogo = 'bsc';
    }
  }

  // (click)="onClickOutside($event)" 
  // onClickOutside(event: Event): void {
  //   // Stop the event propagation to prevent it from reaching the document click listener
  //   console.log(event);
  //   event.stopPropagation();
  //   this.showNetwork = false;
  // }
  ngOnInit(): void {

   this.controllingNetwork();
  

    this.networkList = [
      {network:"BNB Smart Chain" , label: "bsc" ,logo: "" , adress:"0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
      {network:"Etherium" , label: "erc20" ,logo: "" , adress:"0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE" },
      {network:"Polygon" , label: "polygon" ,logo: "" , adress:"0x4E1000616990D83e56f4f6Ff6208d31e0F52350d" },
      {network:"BitTorrent" , label: "btt" ,logo: "" , adress:"0xFA456Cf55250A839088b27EE32A424d7DAc7f8c3"  }
    ]

    this.networkList.forEach(item => {
      item.logo = `assets/Images/${item.label}.svg`;
    });


    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;


    if (isPlatformBrowser(this.platformId)) {

      this.fixMenuItemsWidth();
      if (this.router.url.includes('welcome')) {
        this.isWelcomePage = true;
        this.menuAdpool = true;
      }

      if (
        this.router.url.includes('campaign') ||
        this.router.url.includes('wallet') ||
        this.router.url.includes('ad-pools')
      ) {
        this.menuCampaign = true;
      } else {
        this.menuCampaign = false;
      }
      if (isPlatformBrowser(this.platformId)) {
        this.oldHeight = window.innerHeight;
        this.newHeight = this.oldHeight;
      }

      this.isConnected = false;
      setInterval(async () => {
        await this.voteService.checkWalletConnected();
      }, 700);
    }


  }

  isDisplayNew() {
    this.displayNew = localStorage.getItem('display')?.toString();

    if (this.existV1 && this.existV2) {
      if (this.displayNew === 'none') {
        this.displayNew = 'block';
        this.displayOld = 'none';
        localStorage.setItem('display', this.displayNew);
        this.titleWallet = 'Your wallet ID';
        this.title = 'Go to old wallet';
      } else {
        this.displayNew = 'none';
        this.displayOld = 'block';
        localStorage.setItem('display', this.displayNew);
        this.titleWallet = 'Your old wallet';
        this.title = 'Go to new wallet ';
      }
    }
  }




  checkMenuAdpool() {
    this.menuWallet = false;
    this.menuAdpool = true;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  isClicked() {
    this.clicked = !this.clicked;
  }



  hashLink(network: any, link: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (network === 'eth') {
        window.open(etherscan + link, '_blank');
      } else if (network === 'bsc') {
        window.open(bscan + link, '_blank');
      } else if (network === 'tron' && isPlatformBrowser(this.platformId)) {
        window.open(tronScan + link, '_blank');
      }
    }
  }






  toggleSidebar() {
    this.sidebarService.toggle();
  }

  toggleSidebarMobile() {
    this.sidebarService.toggleFooterMobile.next(false);
    if (this.sidebarService.toggleSidebarMobile.value) {
      this.showMore = false;
      this.showWallet = false;
      this.sidebarService.toggleSidebarMobile.next(false);
    } else {
      this.sidebarService.toggleSidebarMobile.next(true);
      this.showMore = false;
      this.showWallet = false;
    }
  }

  toggleMoreMobile() {
    this.sidebarService.toggleFooterMobile.next(false);

  }


  closeShowMore() {
    this.sidebarService.toggleFooterMobile.next(false);
    if (this.showMore) {
      // this.showMore = !this.showMore;
      this.showWallet = false;
      this.showNotifications = true;
    } else if (this.sidebarService.toggleSidebarMobile.value) {
      this.sidebarService.toggleSidebarMobile.next(false);
      this.showWallet = false;
      this.showNotifications = true;
    } else if (this.showWallet) {
      this.showWallet = false;
      this.showNotifications = true;
    } else if (!this.showNotifications) {
      this.showNotifications = true;
      this.showWallet = false;
    }

  }
  @HostListener('window:resize', ['$event'])
  onScreenResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.newHeight = event.target.innerHeight;
      if (this.newHeight !== this.oldHeight) {
        this.oldHeight = this.newHeight;

      }

      if (this.mediaQueryList?.matches) {
        this.notifItemSize = 150;

      } else {
        if (this.notifItemSize === 150) {
          this.notifItemSize = 111;

        }
      }

      let screenSize = window.innerWidth;
      if (screenSize === 1024) {
        this.sidebarService.toggle();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.eRef.nativeElement?.contains(event.target)) {
        this.isClickedOutside = false;
      } else {
        this.isClickedOutside = true;
      }
    }
  }

  onRedirectOld() {
    if (isPlatformBrowser(this.platformId))
      window.location.href = 'https://old.satt.atayen.us/';
  }


  ////display2////////
  notifSize = 10;







  checkMenuAbout() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com', '_blank');
  }
  checkMenuBlog() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com/blog/', '_blank');
  }




  fixMenuItemsWidth() {
    setTimeout(() => {
      let element0 = this.document.getElementById('introo');
      if (element0) element0.style.width = element0.offsetWidth + 'px';
      let element2 = this.document.getElementById('intro2');
      if (element2) element2.style.width = element2.offsetWidth + 'px';
      let element3 = this.document.getElementById('intro3');
      if (element3) element3.style.width = element3.offsetWidth + 'px';
      let element4 = this.document.getElementById('intro4');
      if (element4) element4.style.width = element4.offsetWidth + 'px';
      let element6 = this.document.getElementById('intro6');
      if (element6) element6.style.width = element6.offsetWidth + 'px';
      let element7 = this.document.getElementById('intro7');
      if (element7) element7.style.width = element7.offsetWidth + 'px';
      let element8 = this.document.getElementById('intro8');
      if (element8) element8.style.width = element8.offsetWidth + 'px';
    }, 1000);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(this.getScreenWidth);
    this.getScreenWidth = event.target.innerWidth;
    if (isPlatformBrowser(this.platformId)) {
      let element0 = this.document.getElementById('introo');
      if (element0) element0.style.removeProperty('width');
      let element2 = this.document.getElementById('intro2');
      if (element2) element2.style.removeProperty('width');
      let element3 = this.document.getElementById('intro3');
      if (element3) element3.style.removeProperty('width');
      let element4 = this.document.getElementById('intro4');
      if (element4) element4.style.removeProperty('width');
      let element6 = this.document.getElementById('intro6');
      if (element6) element6.style.removeProperty('width');
      let element7 = this.document.getElementById('intro7');
      if (element7) element7.style.removeProperty('width');
      let element8 = this.document.getElementById('intro8');
      if (element8) element8.style.removeProperty('width');
      setTimeout(() => {
        this.resized = true;
      }, 6000);
      if (this.resized) {
        this.fixMenuItemsWidth();
        this.resized = false;
      }
    }
  }

  navigateToWelcomePage() {
    this.router.navigate(['/']);
  }
  showPopup() {
    //this.voteService.showConnectDialog();
  }

  hidePopup() {
    //this.voteService.hideConnectDialog();
  }
  show() {
    this.voteService.showNetworkHasChanged();
  }
  hide() {
    this.voteService.hideNetworkHasChanged();
  }
  showInstall() {
    this.voteService.showInstall();
  }

  hideInstall() {
    this.voteService.hideInstall();
  }
  async changeNetwork() {
    // if (this.externalWalletService.networkHasChanged) {
    await this.externalWalletService.changeToBinance(window.ethereum).then(() => {
      this.voteService.hideNetworkHasChanged();
    })
      .catch((error) => {
        // this.hide();
      });
    // }
  }

  sattConnect() {
    window.open(env.domainName + '/auth/login', '_self')
  }
  Disconnect() {
    this.voteService.Disconnect();
  }
  connectWallet = async (walletType: string) => {
    if (walletType === 'metamask') {
      if (this.externalWalletService.isMetaMaskInstalled) {
        this.provider = await this.externalWalletService.connectMetamask();
      } else {
        this.showInstall();
      }
      if (this.externalWalletService.connect === true) {
        // localStorage.setItem('connect', 'true');
      }
    } else if (walletType === 'trust') {
      // this.provider = await this.externalWalletService.connectTrust();
    } else {
      throw new Error('Invalid wallet type');
    }
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
      await this.externalWalletService.checkConnectedWallet();
    }
    // const dialog = document.querySelector('dialog');
    // if (dialog) {
    //   dialog.close();
    // }
    this.hidePopup();
  }

  checkWalletConnected = async () => {
    // console.log("body", this.createProposalForm.value.body)
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await this.externalWalletService.checkConnectedWallet();
      if (accounts.length > 0) {
        this.walletConnected = true;
        this.walletId = accounts[0];
        this.formattedCreator = `${this.walletId.substr(0, 4)}...${this.walletId.substr(-3)}`;
        // this.vp = await this.snapshotService.getVotingPower(this.walletId);
      }
      // else {
      //   this.externalWalletService.connect = false;
      //   // localStorage.setItem('connect', 'false');
      // }
    }
  }
  connectMetaMask() {
    this.voteService.hideConnectDialog(this.connectModal);
    this.voteService.connectWallet('metamask')
  }

  ngOnDestroy(): void {
    if (!!this.isDestroyed$) {
      this.isDestroyed$.next('');
      this.isDestroyed$.complete();
      this.isDestroyed$.unsubscribe();
    }
    //this.translate.onLangChange.unsubscribe();
  }
}
