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
  TemplateRef,
} from '@angular/core';
// import { bscan, etherscan } from '@app/config/atn.config';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ResolveStart,
  NavigationStart,
} from '@angular/router';
import { NotificationService } from '@core/services/notification/notification.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import {
  walletUrl,
  ListTokens,
  sattUrl,
  networkList,
} from '@config/atn.config';
import { User } from '@app/models/User';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { BehaviorSubject, of, Subject, Subscription, timer } from 'rxjs';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import {
  concatMap,
  filter,
  map,
  mapTo,
  mergeMap,
  takeUntil,
  tap,
  startWith,
  take,
  first,
} from 'rxjs/operators';
import Web3Provider from 'web3';

import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { environment } from '@environments/environment';
import { CampaignsService } from '@campaigns/facade/campaigns.facade';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Big } from 'big.js';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { IApiResponse } from '@app/core/types/rest-api-responses';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
import { ReturnStatement } from '@angular/compiler';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { REPL_MODE_STRICT } from 'repl';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoteService } from '@app/core/services/vote/vote.service';
import { ExternalWalletService } from '@app/core/services/vote/external-wallet.service';
import Cookies from 'js-cookie';
import detectEthereumProvider from '@metamask/detect-provider';

const bscan = environment.bscanaddr;
const etherscan = environment.etherscanaddr;
const tronScanAddr = environment.tronScanAddr;
const tronScan = environment.tronScan;
const polygonscanAddr = environment.polygonscanAddr;
const btcScanAddr = 'https://www.blockchain.com/btc/address/';
const bttscanAddr = environment.bttscanAddr;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  adressWallet = new FormControl('');
  currentScreenSize: string | undefined;
  query = '(max-width: 991.98px)';
  mediaQueryList?: MediaQueryList;
  query2 = '(width =   767.9px)';
  mediaQueryList2?: MediaQueryList;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  clicked: boolean = true;
  @ViewChild('myprofile') myprofile?: ElementRef;
  bnbGaz: any;
  ethGaz: any;
  web3!: Web3Provider;

  provider!: any;
  formattedCreator: string | undefined;
  public walletConnected!: boolean;
  languageSelected: any;
  dataNotification: any[] = [];
  user!: User;
  isClickedOutside: boolean = true;
  showMore: boolean = false;
  showWallet: boolean = false;
  showMenuNotif: boolean = false;
  showMenuProfil: boolean = false;
  account!: string[];
  isTransactionHashCopiedtron = false;
  private connectModal!: TemplateRef<any>;
  private infoWalletModal!: TemplateRef<any>;
  existV2: any;
  public walletId: string = '';

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
  showNotifications: boolean = false;
  newNotification: boolean = false;
  networkLabel: any = 'BNB Smart chain';
  networkLogo: any = 'bsc';
  networkList: any = networkList;
  showNetwork: any = false;
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
  menuProfile: boolean = false;
  menuVote: boolean = false;
  menuFarmPost: boolean = false;
  menuHistory: boolean = false;
  menuHelp: boolean = false;
  menuAbout: boolean = false;
  menuBlog: boolean = false;
  menuWallet: boolean = false;
  menuCampaign: boolean = false;
  menuTokenInfo: boolean = false;
  menuBuyToken: boolean = false;
  dynamicTitle: string = '';

  // successPart: boolean = false;
  // errorPart: boolean = false;
  sucess: any = false;

  @ViewChild('qrbtnERCM', { static: false }) qrbtnERCM?: ElementRef;
  @ViewChild('header', { static: false }) header?: ElementRef;
  @ViewChild('headerNav') headerNav?: ElementRef;
  @ViewChild('addressInput') addressInput?: ElementRef;
  allnotification: BehaviorSubject<Array<any>> = new BehaviorSubject([null]);
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

  private account$ = this.accountFacadeService.account$;
  private resized = false;
  menuSendRecieve: boolean = false;
  private isDestroyed$ = new Subject();
  isTransactionHashCopied = false;
  isTransactionHashCopiedbtc = false;
  copyMessage: string = '';
  isLayoutDesktop = false;
  erc20V2: any;
  tronAddressV2: any;
  displayNew: any;
  displayOld: any;
  title: any = '';
  titleWallet: any = '';
  existV1: any;
  showConnectButton: boolean = false;
  @HostListener('window:resize', ['$event'])
  resize(event: any) {
    this.getScreenHeight = event.target.innerHeight;
    this.getScreenWidth = event.target.innerWidth;
  }

  constructor(
    breakpointObserver: BreakpointObserver,
    private accountFacadeService: AccountFacadeService,
    private NotificationService: NotificationService,
    public router: Router,
    public voteService: VoteService,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
    public sidebarService: SidebarService,
    private eRef: ElementRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private campaignDataStore: CampaignsStoreService,
    private clipboard: Clipboard,
    private ParticipationListStoreService: ParticipationListStoreService,
    private toastr: ToastrService,
    private walletFacade: WalletFacadeService,
    private renderer: Renderer2,
    private walletService: WalletService,
    public externalWalletService: ExternalWalletService,
    private campaignFacade: CampaignsService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private authStoreService: AuthStoreService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private kycFacadeService: KycFacadeService,
    private route: ActivatedRoute,
    private hostElement: ElementRef,
    private titleService: Title,
    public modalService: NgbModal,
    private cookieService: CookieService
  ) {
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const token = !!Cookies.get('jwt') ? Cookies.get('jwt') : '';
        const selectedAddress = !!Cookies.get('metamaskAddress') ? Cookies.get('metamaskAddress') : '';
        if(!!window.ethereum) {
          if(token != '' && selectedAddress != '') this.voteService.verifyToken();
          else {
            this.externalWalletService.connect = false;
            this.externalWalletService.isWalletConnected = false;
            this.tokenStorageService.setIsAuth('false');
          } 
        }
        
      }
    });

    
      if (!!window.ethereum) {
        // Listen for account changes
        //const selectedAddress = !!Cookies.get('metamaskAddress') ? Cookies.get('metamaskAddress') : '';
       
        window.ethereum.on('accountsChanged', (accounts:any) => {
        console.log({accounts});
        if(accounts.length > 0) {
          this.voteService.createAccount(window.ethereum.selectedAddress);
        } else {
          this.tokenStorageService.setIsAuth('false');
          this.cookieService.delete('UserId');
          this.cookieService.delete('jwt');
          this.cookieService.delete('metamaskAddress');
        }
          
        })
        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          switch (chainId) {
            case '0x1':
              this.networkLabel = 'Ethereum';
              this.networkLogo = 'erc20';
              break;
            case '0x38':
              this.networkLabel = 'BNB Smart Chain';
              this.networkLogo = 'bsc';
              break;
            case '0x89':
              this.networkLabel = 'Polygon';
              this.networkLogo = 'polygon';
              break;
            case '0xc7':
              this.networkLabel = 'BitTorrent';
              this.networkLogo = 'btt';
              break;
            case '0x61':
              this.networkLabel = 'BNB Testnet';
              this.networkLogo = 'bsc';
              break;
            case '0x2802':
              this.networkLabel = 'Arthera';
              this.networkLogo = 'arthera';
              break;
            default:
              
              const network = {
                label: 'bsc',
                logo: 'assets/Images/bsc.svg',
                network: 'BNB Smart Chain',
              };
              detectEthereumProvider().then((provider) => {
                this.externalWalletService
                  .changeNetwork(provider, network.label)
                  .then((val) => {
                    this.networkLabel = network.network;
                    this.networkLogo = network.label;
                    Cookies.set('networkSelected', this.networkLabel, {
                      secure: true,
                      sameSite: 'Lax',
                    });
                    Cookies.set('networkSelectedLogo', this.networkLogo, {
                      secure: true,
                      sameSite: 'Lax',
                    });
                  });
              });
            
          }

          
          Cookies.set('networkSelected', this.networkLabel, {
            secure: true,
            sameSite: 'Lax',
          });
          Cookies.set('networkSelectedLogo', this.networkLogo, {
            secure: true,
            sameSite: 'Lax',
          });
        });
      } else {
        console.error('MetaMask not detected.');
      }
    

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

    

    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocale();
      translate.setDefaultLang(this.languageSelected);
      this.fixMenuItemsWidth();
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
      this.fixMenuItemsWidth();
    }
    this.router.events.pipe(takeUntil(this.isDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('welcome')) {
          this.isWelcomePage = true;
        } else {
          this.isWelcomePage = false;
        }

        if (
          event.url.includes('campaign') ||
          event.url.includes('wallet') ||
          event.url.includes('wallet/receive') ||
          event.url === '/home' ||
          event.url.includes('wallet')
        ) {
          this.menuCampaign = true;
        } else {
          this.menuCampaign = false;
        }
        if (this.router.url.includes('welcome')) {
          this.checkMenuAdpool();
        }

        if (this.router.url.includes('social-networks')) {
          this.checkSocialNetwork();
        }

        if (this.router.url.includes('vote')) {
          this.checkMenuVote();
        }

        if (
          this.router.url.includes('buy-token') ||
          this.router.url.includes('edit')
        ) {
          //@ts-ignore
          // this.header?.nativeElement.style.background =
          //   'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)';
          // this.renderer.setStyle(
          //   this.header?.nativeElement,
          //   'background',
          //   'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)'
          // );
          this.isWelcomePage = false;
          this.menuBuyToken = true;
        }
      }
    });
  } 


  isUserConnected() {
    
      if(!!window.ethereum && !!Cookies.get('metamaskAddress') && !!Cookies.get('jwt')) {
      this.formattedCreator = `${Cookies.get('metamaskAddress')?.toString().substring(
        0,
        6
      )}...${Cookies.get('metamaskAddress')?.toString().substring((Cookies.get('metamaskAddress')?.toString()?.length ?? 0) - 3)}`;
      const isAuth = this.tokenStorageService.getIsAuth();
      isAuth === 'false' && this.tokenStorageService.setIsAuth('true');
      
      return true;
    } else {
      this.formattedCreator = '';
      this.tokenStorageService.setIsAuth('false');
      return false;
    }
    
  }

  getAccountsAndSetAddress = async() => {
    try {
      if(!!window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
          params: []
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          this.adressWallet = new FormControl(address);
          // Use adressWallet as needed
        } else {
          console.error("No Ethereum accounts found");
        }
      }
      
    } catch (error) {
      console.error("Error requesting accounts:", error);
      // Handle errors appropriately
    }
  }
  showAdressWallet = () => window.ethereum.selectedAddress;


  copyAddressToClipboard() {
    let elementToCopy = this.adressWallet.value
    if (elementToCopy) {
      navigator.clipboard
        .writeText(elementToCopy)
        .then(() => {
          console.log('Content copied to clipboard');
          this.copyMessage = 'Copied!';
          setTimeout(() => {
            this.copyMessage = '';
          }, 2000)
    })
          .catch((error) =>
          console.error('Failed to copy content to clipboard:', error)
        );
    }
  }

  ngAfterViewInit(): void {
   
    this.route.url.subscribe((e) => {});
    this.router.events
      .pipe(
        tap((e) => {}),
        filter((e: any) => e instanceof NavigationEnd),
        startWith({ url: this.router.url })
      )
      .subscribe((e: any) => {});
  }

  toggleNetworkList() {
    this.showNetwork = !this.showNetwork;
  }

  displayNetwork(e: any) {
    if (this.networkLogo != e.label) {
      detectEthereumProvider().then((provider) => {
        this.externalWalletService
          .changeNetwork(provider, e.label)
          .then((val) => {
            this.networkLabel = e.network;
            this.networkLogo = e.label;
            Cookies.set('networkSelected', this.networkLabel, {
              secure: true,
              sameSite: 'Lax',
            });
            Cookies.set('networkSelectedLogo', this.networkLogo, {
              secure: true,
              sameSite: 'Lax',
            });
          });
      });
    }
  }

  controllingNetwork() {
    try {
      this.networkLabel = Cookies.get('networkSelected') || 'BNB SMART CHAIN';
      this.networkLogo = Cookies.get('networkSelectedLogo') || 'bsc';
    } catch (error) {
      console.error('Error retrieving or setting cookie:', error);
      this.networkLabel = 'bnb smart chain';
    }
  }

  ngOnInit(): void {
    this.getAccountsAndSetAddress();
    this.controllingNetwork();
    this.networkList.forEach(
      (item: { network: string; label: string; logo: string }) => {
        item.logo = `assets/Images/${item.label}.svg`;
      }
    );

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    if (isPlatformBrowser(this.platformId)) {
      this.fixMenuItemsWidth();
      if (this.router.url.includes('welcome')) {
        this.isWelcomePage = true;
        this.menuAdpool = true;
      }
      if (this.router.url.includes('wallet')) {
        this.menuWallet = true;
      }
      if (this.router.url.includes('notification')) {
        this.menuHistory = true;
      }
      if (this.router.url.includes('FAQ')) {
        this.menuHelp = true;
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
    }
  }

  showInstall() {
    this.voteService.showInstall();
  }

  hideInstall() {
    this.voteService.hideInstall();
  }

  async changeNetwork() {
    // if (this.externalWalletService.networkHasChanged) {
    await this.externalWalletService
      .changeToBinance(window.ethereum)
      .then(() => {
        this.voteService.hideNetworkHasChanged();
      })
      .catch(() => {
        // this.hide();
      });
    // }
  }

  closeModal() {
    this.modalService.dismissAll(this.connectModal);
  }

  closeInfoWalletModal() {
    this.modalService.dismissAll(this.infoWalletModal);
  }

  connect(content: any) {
    this.modalService.open(content);
  }

  showTransactions(addressWallet: string) {
    let network = Cookies.get('networkSelected');
    let url: string;
    switch (network) {
      case 'BinanceSmartChain':
        url = `https://bscscan.com/address/${addressWallet}`;
        break;
      case 'Ethereum':
        url = `https://etherscan.io/address/${addressWallet}`;
        break;
      case 'Polygon':
        url = `https://polygonscan.com/address/${addressWallet}`;
        break;
      case 'BitTorrent': 
      url = `https://bttcscan.com/address/${addressWallet}`;
        break;
      case 'Arthera':
        url = `https://explorer.arthera.net/address/${addressWallet}`;
        break;
      default:
         url = `https://bscscan.com/address/${addressWallet}`;
        break;
    }
    (url) ? window.open(url, '_blank') : console.error('Invalid network:', network);
  }

  sattConnect() {
    window.open(environment.domainName + '/auth/login', '_self');
  }

  Disconnect() {
    this.voteService.Disconnect();
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
    if (this.sidebarService.toggleWalletMobile.value) {
      this.sidebarService.toggleWalletMobile.next(false);
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


  goToEther(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(etherscan + erc20, '_blank');
  }
  goToBscan(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bscan + erc20, '_blank');
  }
  goToBtc() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://www.blockchain.com', '_blank');
  }
  goToPolygonScan(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(polygonscanAddr + erc20, '_blank');
  }

  goToTronScan(tronAddress: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(tronScanAddr + tronAddress, '_blank');
  }
  goToBTTScan(tronAddress: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bttscanAddr + tronAddress, '_blank');
  }
  goToBtcScan(btcCode: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(btcScanAddr + btcCode, '_blank');
  }

  checkMenu() {
    if (this.router.url.includes('ad-pools')) {
      this.menuAdpool = true;
    } else {
      this.menuAdpool = false;
    }
  }

  checkMenuFarmPost() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = false;
    this.menuVote = false;
    this.menuFarmPost = true;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }

  checkMenuBuyToken() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = false;
    this.menuVote = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = true;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }

 
  checkMenuAbout() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com', '_blank');
  }

  checkMenuBlog() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com/blog/', '_blank');
  }

  checkSocialNetwork() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = true;
    this.menuVote = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }

  checkMenuVote() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = false;
    this.menuVote = true;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuAdpool() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    this.menuWallet = false;
    this.menuAdpool = true;
    this.menuProfile = false;
    this.menuVote = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuHistory() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = false;
    this.menuVote = false;
    this.menuFarmPost = false;
    this.menuHistory = true;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuHelp() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuProfile = false;
    this.menuVote = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = true;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuWallet() {
    this.titleService.setTitle('SaTT - Smart advertising Transaction Token');
    if (this.isConnected) {
      this.menuWallet = true;
      this.menuAdpool = false;
      this.menuProfile = false;
      this.menuVote = false;
      this.menuFarmPost = false;
      this.menuHistory = false;
      this.menuHelp = false;
      this.menuBuyToken = false;
      this.menuTokenInfo = false;
      this.menuAbout = false;
      this.menuBlog = false;
      this.walletService.dismissPage.next(true);
    } else {
      this.checkMenuAdpool();
    }
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
      this.account = await this.web3.eth.getAccounts();
      await this.externalWalletService.checkConnectedWallet();
    }
  };
  
  checkWalletConnected () {
    const token = !!Cookies.get('jwt') ? Cookies.get('jwt') : '';
        const selectedAddress = !!Cookies.get('metamaskAddress') ? Cookies.get('metamaskAddress') : '';
        if(!!window.ethereum) {
          if(token != '' && selectedAddress === window.ethereum.selectedAddress) this.voteService.verifyToken();
          else {
            this.externalWalletService.connect = false;
            this.externalWalletService.isWalletConnected = false; 
          } 
        }
  };

  connectMetaMask() {
    this.voteService.hideConnectDialog(this.connectModal);
    this.voteService.connectWallet('metamask');
  }

  ngOnDestroy(): void {
    if (!!this.isDestroyed$) {
      this.isDestroyed$.next('');
      this.isDestroyed$.complete();
      this.isDestroyed$.unsubscribe();
    }
  }

  
}
