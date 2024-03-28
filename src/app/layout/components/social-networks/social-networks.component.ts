import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomToastComponent } from '../custom-toast/custom-toast.component';
import { environment as env } from '../../../../environments/environment';
import Cookies from 'js-cookie';
import { ExternalWalletService } from '@app/core/services/vote/external-wallet.service';
import { ProfileService } from '@app/core/services/profile/profile.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { sattUrl } from '@app/config/atn.config';
export interface IGetSocialNetworksResponse {
  facebook: { [key: string]: string | boolean }[];
  google: { [key: string]: string | boolean }[];
  linkedin: { [key: string]: string | boolean }[];
  twitter: { [key: string]: string | boolean }[];
  tiktok: { [key: string]: string | boolean }[];
}
@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit {
  nameAccount = '';
  networkLogo = './assets/Images/youtube-add.png';
  networkLogoFacebook = './assets/Images/fb_image.svg';
  networkLogoTwitter = './assets/Images/twitter.svg';
  networkLogoInstagram = './assets/Images/img_satt/Instagram.png';
  networkLogoThreads = './assets/Images/img_satt/Threads.png';
  networkLogoLinkedin = './assets/Images/linkedin-icon.svg';
  networkLogoTiktok = './assets/Images/tiktok.svg';
  networkLogoFacebookInsta='./assets/Images/Fb_insta.svg';
  accounts: any;
  accountsTwitter: any;
  channelId: string = '';
  twitterId: string = '';
  organization: string = '';
  channelTitle: string = '';
  id: string = '';
  channelName: string = '';
  errorMessage = '';
  successMessage = '';
  routerSub: any;
  channelGoogle: any;
  channelTwitter: any;
  channelFacebook: any;
  channelInstagram: any;
  channelLinkedin: any;
  channelTiktok: any;
  channelThreads: any;
  allChannels: any;
  showGoogleList: boolean = false;
  showTwitterList: boolean = false;
  showFacebookList: boolean = false;
  showLinkedinList: boolean = false;
  showTiktokList: boolean = false;
  deactivateGoogle: boolean = false;
  deactivateLinkedin: boolean = false;
  deactivateTwitter: boolean = false;
  deactivateFacebook: boolean = false;
  deactivateTiktok: boolean = false;
  networkName: string = '';
  percentSocial: any;
  isLoading: any = false;
  threadIdToDelete: any = '';
  private isDestroyed = new Subject();
  userId = Cookies.get('UserId');
  showSpinner: boolean = true;
  checkThreadsExist: boolean = false;
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    public externalWalletService: ExternalWalletService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngOnInit(): void {
    this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
    this.getSocialNetwork()
  }

  showToast(message: string): void {
    this.snackBar.openFromComponent(CustomToastComponent, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'end', // Position of the toast (e.g., 'start', 'center', 'end')
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'],
      data: {icon:'./assets/Images/error-icon.png', message: message}
    });
  }
  openModalDeleteOne(
    content: any,
    title: string,
    id: string,
    network: string,
    chname: string,
    threadsId? :any
  ) {
    if(!!threadsId)  this.threadIdToDelete = threadsId;
    this.modalService.open(content);
    this.channelTitle = title;
    this.channelId = id;
    this.networkName = network;
    this.channelName = chname;
  }
  openModalDeleteAll(content: any, network: string) {
    this.modalService.open(content);
    this.networkName = network;
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
    this.networkName = '';
  }
  // numberTiktok(){
  //   this.profile.getTicTokNbFollowers(3871).subscribe((data)=>{
  //     console.log({data});

  //     // this.tiktokFollowers=data.data
  //   })
  // }

  getPercentSocial() {
    let count = 0;
    if (this.channelGoogle?.length !== 0) {
      count++;
    } else {
      this.channelGoogle?.forEach((ch: any) => {
        this.deactivateGoogle = !!this.allChannels.google[ch].deactivate;
      });
    }

    if (this.channelTwitter?.length !== 0) {
      count++;
    } else {
      this.channelTwitter?.forEach((ch: any) => {
        this.deactivateTwitter = !!this.allChannels.twitter[ch].deactivate;
      });
    }

    if (this.channelFacebook?.length !== 0) {
      count++;
    } else {
      this.channelFacebook?.forEach((ch: any) => {
        this.deactivateFacebook = !!this.allChannels.facebook[ch].deactivate;
      });
    }

    if (this.channelLinkedin?.length !== 0) {
      count++;
    } else {
      this.channelLinkedin?.forEach((ch: any) => {
        this.deactivateLinkedin = !!this.allChannels.linkedin[ch].deactivate;
      });
    }

    if (this.channelTiktok?.length !== 0) {
      count++;
    } else {
      this.channelTiktok?.forEach((ch: any) => {
        this.deactivateTiktok = !!this.allChannels.tiktok[ch].deactivate;
      });
    }
    
    let stat = (count * 100) / 5;
   
    
    this.percentSocial = stat.toFixed(0);
    return this.percentSocial
  }

  getUserConnectedStatus() {
    if(this.tokenStorageService.getIsAuth() != 'true') return false;
    else return true;
  }

  getSocialNetwork(): void {
    this.showSpinner = true;
    this.profileService.getSocialNetworks().pipe(
      catchError(() => {
        return of(null);
      }),
      mergeMap((data) => {
        return this.route.queryParams.pipe(
          map((params) => {
            return { params, data };
          })
        );
      }),
      takeUntil(this.isDestroyed)
    ).subscribe(
      ({ params, data }: { params: Params; data: any }) => {
        if (data !== null) {
          let count = 0;
          this.allChannels = data.data;
          this.channelGoogle = data.data.google;
          this.channelTwitter = data.data.twitter;
          this.channelFacebook = data.data.facebook;
          this.channelLinkedin = data.data.linkedin;

          this.channelTiktok = data.data.tikTok;
          this.setUrlMsg(params, data.data);
         this.channelThreads = this.checkTheradsAccountExit(data.data)
        
        
         
          if (this.channelGoogle?.length !== 0) {
            count++;
          } else {
            this.channelGoogle?.forEach((ch: any) => {
              this.deactivateGoogle = !!data.google[ch].deactivate;
            });
          }

          if (this.channelTwitter?.length !== 0) {
            count++;
          } else {
            this.channelTwitter?.forEach((ch: any) => {
              this.deactivateTwitter = !!data.twitter[ch].deactivate;
            });
          }

          if (this.channelFacebook?.length !== 0) {
            count++;
          } else {
            this.channelFacebook?.forEach((ch: any) => {
              this.deactivateFacebook = !!data.facebook[ch].deactivate;
            });
          }

          if (this.channelLinkedin?.length !== 0) {
            count++;
          } else {
            this.channelLinkedin?.forEach((ch: any) => {
              this.deactivateLinkedin = !!data.linkedin[ch].deactivate;
            });
          }

          if (this.channelTiktok?.length !== 0) {
            count++;
          } else {
            this.channelTiktok?.forEach((ch: any) => {
              this.deactivateTiktok = !!data.tiktok[ch].deactivate;
            });
          }
          
          let stat = (count * 100) / 5;
         
          
          this.percentSocial = stat.toFixed(0);
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        } else {
          this.percentSocial = 0;
          this.allChannels = [];
          this.channelGoogle = [];
          this.channelTwitter = [];
          this.channelFacebook = [];
          this.channelLinkedin = [];
          this.channelTiktok = [];
          this.channelThreads= [];
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        }
      }
    )
    /*this.socialAccount$
      .pipe(
        catchError(() => {
          return of(null);
        }),
        mergeMap((data) => {
          return this.route.queryParams.pipe(
            map((params) => {
              return { params, data };
            })
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(({ params, data }: { params: Params; data: any }) => {
        if (data !== null) {
        
          let count = 0;
          this.allChannels = data;
          this.channelGoogle = data.google;
          this.channelTwitter = data.twitter;
          this.channelFacebook = data.facebook;
          this.channelLinkedin = data.linkedin;

          this.channelTiktok = data.tikTok;
          this.setUrlMsg(params, data);
         this.channelThreads = this.checkTheradsAccountExit(data)
        
        
         
          if (this.channelGoogle?.length !== 0) {
            count++;
          } else {
            this.channelGoogle?.forEach((ch: any) => {
              this.deactivateGoogle = !!data.google[ch].deactivate;
            });
          }

          if (this.channelTwitter?.length !== 0) {
            count++;
          } else {
            this.channelTwitter?.forEach((ch: any) => {
              this.deactivateTwitter = !!data.twitter[ch].deactivate;
            });
          }

          if (this.channelFacebook?.length !== 0) {
            count++;
          } else {
            this.channelFacebook?.forEach((ch: any) => {
              this.deactivateFacebook = !!data.facebook[ch].deactivate;
            });
          }

          if (this.channelLinkedin?.length !== 0) {
            count++;
          } else {
            this.channelLinkedin?.forEach((ch: any) => {
              this.deactivateLinkedin = !!data.linkedin[ch].deactivate;
            });
          }

          if (this.channelTiktok?.length !== 0) {
            count++;
          } else {
            this.channelTiktok?.forEach((ch: any) => {
              this.deactivateTiktok = !!data.tiktok[ch].deactivate;
            });
          }
          if (this.channelThreads !== false) {
   
            count++;
          }
          let stat = (count * 100) / 6;
         
          
          this.percentSocial = stat.toFixed(0);
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        } else {
          this.percentSocial = 0;
          this.allChannels = [];
          this.channelGoogle = [];
          this.channelTwitter = [];
          this.channelFacebook = [];
          this.channelLinkedin = [];
          this.channelTiktok = [];
          this.channelThreads= [];
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        }
      });*/
  }
  checkTheradsAccountExit(data:any)
  {     
   return false    
   }  
  
   clearMessages = (): void => {
    this.errorMessage = '';
    this.successMessage = '';
  };

  redirectToSocialNetworksSettings = (): void => {
    this.router.navigate(['/home/social-networks']);
  };
  
  //get errors from url
  setUrlMsg(p: Params, data: IGetSocialNetworksResponse): void {
    const showMessage = (
      message: string,
      type: 'error' | 'success',
      redirect = true
    ): void => {
      if (type === 'error') {
        this.errorMessage = message;
      } else if (type === 'success') {
        this.successMessage = message;
      }
      setTimeout(() => {
        this.clearMessages();
        if (redirect) {
          this.redirectToSocialNetworksSettings();
        }
      }, 3000);
    };
  
   
    switch (p['frontendApp']) {
      case 'metamask?message=access-denied':
        showMessage('access-cancel', 'error');
        break;
  
      case 'metamask?message=channel obligatoire':
      case 'metamask?message=required_page':
        showMessage('no_page_selected', 'error');
        break;
  
      case 'metamask?message=account_linked_with_success':
      case 'metamask?message=account_linked_with_success_facebook':
      case 'metamask?message=account_linked_with_success_instagram_facebook':
        if (p['sn'] === 'fb' && data.facebook.length === 0) {
          showMessage('no_page_selected', 'error', false);
        } else {
          showMessage('account_linked_with_success', 'success');
        }
        break;
  
      case 'metamask?message=account exist':
        showMessage('account_linked_other_account', 'error');
        break;
  
      case 'metamask?message=external_account':
        showMessage('Your facebook page', 'error', false);
        break;
  
      case 'metamask?message=page already exists':
        showMessage('page already exists', 'error');
        break;
  
      default:
        break;
    }
  }
  

  onReditectSocial(social: string) {
    //let url = this.router.url.split('?')[0];
    const userId = Cookies.get('UserId');
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        `/profile/addChannel/${social}/${userId}` +
        '?redirect=' +
        this.router.url + '?frontendApp=metamask';
  }
  onReditectLinkedin() {
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/profile/addChannel/linkedin/' +
        this.userId +
        '?redirect=' +
        this.router.url;
  }

goToAccount(oracle: string, userName: string) {
    const networkUrls: { [key: string]: string } = {
      twitter: env.urlSocialMedia.urlTwitter,
      google: env.urlSocialMedia.urlGoogleChannel,
      facebook: env.urlSocialMedia.urlFacebook,
      instagram: env.urlSocialMedia.urlInstagram,
      linkedin: env.urlSocialMedia.urlLinkedinCompany,
      tiktok: env.urlSocialMedia.urlTiktok,
      threads: env.urlSocialMedia.urlthreadsAccount
    };
  
    if (isPlatformBrowser(this.platformId)) {
      const socialMediaBaseUrl = networkUrls[oracle];
      
      if (socialMediaBaseUrl) {
        let url = socialMediaBaseUrl;
  
        if (oracle === env.oracleType.linkedin) {
          const parts = userName.split(":");
          const linkedinId = parts[3];
          url += linkedinId;
        } else if (oracle === env.oracleType.tiktok) {
          url += userName.replace(/\s/g, '');
        } else {
          url += userName;
        }
  
        window.open(url, '_blank');
      }
    }
  }
  toggelGoogleBlock() {
    this.showGoogleList = !this.showGoogleList;
  }
  toggelTwitterBlock() {
    this.showTwitterList = !this.showTwitterList;
  }
  toggelFacebookBlock() {
    this.showFacebookList = !this.showFacebookList;
  }
  toggelLinkedinBlock() {
    this.showLinkedinList = !this.showLinkedinList;
  }
  toggelTiktokBlock() {
    this.showTiktokList = !this.showTiktokList;
  }

  deleteAccount(id: string, network: string,linkedinId : string ="") {
    console.log(id,"id");
    if (network === 'google') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksGoogle(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'twitter') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksTwitter(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            const index = this.channelTwitter.findIndex((ch: {
              _id: string; 
}) => ch._id === id);
            if (index !== -1) {
              this.channelTwitter.splice(index, 1);
            }
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
            console.log('done');
          }
        });
    } else if (network === 'facebook') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksFb(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            const index = this.channelFacebook.findIndex((ch: {
              _id: string; 
}) => ch._id === id);
            if (index !== -1) {
              this.channelFacebook.splice(index, 1);
            }
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'linkedin') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksLinkedin(id,linkedinId)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            const index = this.channelLinkedin.findIndex((ch: {
              _id: string; 
}) => ch._id === id);
            if (index !== -1) {
              this.channelLinkedin.splice(index, 1);
            }
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'tiktok') {
      this.socialAccountFacadeService
        .deleteTiktokChannel(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            const index = this.channelTiktok.findIndex((ch: {
              _id: string; 
}) => ch._id === id);
            if (index !== -1) {
              this.channelTiktok.splice(index, 1);
            }
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    }
    
  }

  deleteList(modalName: any, network: string) {
    if (network === 'google') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksGoogle()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.channelGoogle = [];
            this.percentSocial -= 20;
            this.closeModal(modalName);
          }
        });
    } else if (network === 'facebook') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksFb()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.channelFacebook = [];
            this.percentSocial -= 20;
            this.closeModal(modalName);
          }
        });
    } else if (network === 'twitter') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksTwitter()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.channelTwitter = [];
            this.percentSocial -= 20;
            this.closeModal(modalName);
          }
        });
    } else if (network === 'linkedin') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksLinkedin()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.channelLinkedin = [];
            this.percentSocial -= 20;
            this.closeModal(modalName);
          }
        });
    } else if (network === 'tiktok') {
      this.socialAccountFacadeService
        .deleteAllTiktokChannels()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.channelTiktok = []
            this.percentSocial -= 20;
            this.closeModal(modalName);
          }
        });
    }
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }
  safeImageUrl(base64Image: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${base64Image}`);
  }
  getUpdatedItem(item:any, res:any) {
    const updatedItem = {
      ...item,
      threads_id: res.data.id,
      threads_picture: res.data.picture
    };
    return updatedItem;
  }
  addThreadsAccount() {
    this.isLoading = true;
    this.socialAccountFacadeService.addThreads().subscribe((res:any) => {
      if(res.message === 'threads_account_added') {
        this.isLoading = false;
    this.checkThreadsExist= true;
        const index = this.channelFacebook.findIndex((obj:any) => obj.instagram_username === res.data.username);
        if(index !== -1) {

          
          let newObj = {
            ...this.channelFacebook[index],
            threads_id: res.data.id,
            threads_picture: res.data.picture,
            threads_followers: res.data.threads_followers
          }
          this.channelFacebook = [
            ...this.channelFacebook.slice(0, index), 
            newObj,
            ...this.channelFacebook.slice(index + 1), 
          ];
          this.channelFacebook[index] = newObj;
        }
      } else if(res.message === 'threads_not_found'){
        this.isLoading = false;
        this.showToast('Sorry we cant find threads account with this name !');
      } else {
        this.isLoading = false;
        this.showToast('Something went wrong, please try again!');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.showToast('Something went wrong, please try again!');
    })
  }
  trackByChannelId(index: any, ch: any) {
    return ch?.id;
  }

  trackByChannelOrganization(index: any, ch: any) {
    return ch?.organization;
  }

  trackBuChannelDisplayName(index: any, ch: any) {
    return ch?.displayName;
  }

  trackByCahnnelName(index: any, ch: any) {
    return ch?.name;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}