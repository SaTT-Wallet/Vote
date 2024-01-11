import { Component, Inject, Input, OnInit,NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { Participation } from '@app/models/participation.model';
import _ from 'lodash';
import { Page } from '@app/models/page.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { Big } from 'big.js';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { compare } from '@helpers/utils/math';
import { youtubeThumbnail } from '@config/atn.config';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
@Component({
  selector: 'app-farm-posts',
  templateUrl: './farm-posts.component.html',
  styleUrls: ['./farm-posts.component.css'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }), // initial
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        ) // final
      ])
    ])
  ]
})

// TODO: [SW-82] create participation-card component

// ../../components/campaign-detail-gains/campaign-detail-gains.component.css
export class FarmPostsComponent implements OnInit {
  private walletIdSubscription!: Subscription;
  private queryParamSubscription: Subscription | undefined;

  throttle = 0;
  distance = 2;
  onScrollSubject = new Subject();
  isDestroyed = new Subject();
  showWelcome: boolean = false;
  listLinks: Participation[] = [];
  showSpinner: boolean = true;
  postsNumber: number = 0;
  subscription: Subscription | undefined;
  promHash = '';
  link: boolean = false;
  hash: any;
  @Input() isFormatGrid: boolean = true;
  isStyleGrid: boolean = true;
  searchData: string = '';
  sortDownRestToClaim: boolean = true;
  sortDownEarnings: boolean = true;
  sortDownMedia: boolean = true;
  sortDownSendBy: boolean = true;
  sortDownDate: boolean = true;
  sortDownViews: boolean = true;
  sortDownLikes: boolean = true;
  sortDownShares: boolean = true;
  sortDownAbosNumber: boolean = true;
  showFilter: boolean = false;
  showSort: boolean = false;
  sortItem = '';
  constructor(
    private router: Router,
    public ParticipationListService: ParticipationListStoreService,
    private campaignService: CampaignHttpApiService,
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private sanitizer: DomSanitizer,
    private tokenStorageService :TokenStorageService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.ParticipationListService.isEarnings = false;
    this.setQuery();
  
    this.walletIdSubscription = this.tokenStorageService.idWallet$
    .pipe(takeUntil(this.isDestroyed))
    .subscribe((walletId: string) => {
      console.log('Wallet ID changed:', walletId);
      if (walletId) {
        this.getLink();
      }
    });

    this.ParticipationListService.list$
      .pipe(
        map((pages: Page<Participation>[]) =>
          _.flatten(pages.map((page: Page<Participation>) => page.items))
        ),
        takeUntil(this.isDestroyed)
      )
      .subscribe((links: Participation[]) => {
        this.showSpinner = false;
        this.postsNumber = this.ParticipationListService.countLinks;
        this.listLinks = links;
        if (links.length === 0 && this.postsNumber === 0) {
          this.showWelcome = true;
          this.router.navigate(['/farm-posts/no-posts-to-farm']);
        }
      });

    this.ParticipationListService.loadLinks()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe();

      window.addEventListener('scroll', this.onWindowScroll.bind(this), true);

  }
  setQuery() {
    this.ParticipationListService.setQueryParams({ campaignId: '', state: '' });
  }

  private debounceTimeout: any;

  onWindowScroll(): void {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(async () => {
      // Your existing scroll logic here
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
      // Define a threshold (e.g., 50 pixels from the bottom)
      const threshold = 50;
  
      // Check if the user has scrolled close to the bottom of the page
      if (scrollPosition + viewportHeight >= documentHeight - threshold) {
  
       await this.ParticipationListService.loadNextPage(10, false, 2)
          .pipe(takeUntil(this.isDestroyed))
          .subscribe();
      }
    }, 100);  // Adjust the delay (e.g., 100ms) as needed
  }
  
  
  

getLink(): void {
  
  this.route.queryParamMap
    .pipe(takeUntil(this.isDestroyed))
    .subscribe((queryParams) => {
      const promHash = queryParams.get('promHash');
      if (promHash) {
        let itemFound = false;
        this.listLinks.forEach((item) => {
          itemFound = promHash === item.hash;
          if (itemFound) {
            this.scroller.scrollToAnchor(promHash);
          }
        });

        if (!itemFound) {
          this.ParticipationListService.loadNextPage({}, false, {});
        }
      }
    });
}


  // ngAfterViewInit() {
  //   this.promHash = this.route.snapshot.queryParamMap.get('promHash') as string;
  //   console.log(this.promHash);
  //   if (this.promHash) {
  //     this.listLinks.map((item) => {
  //       if (this.promHash !== item.hash) {
  //         this.ParticipationListService.emitPageScroll();
  //       }
  //     });
  //     this.scroller.scrollToAnchor(this.promHash);
  //   }
  // }
  listenForStyleHost(event: boolean) {
    this.isStyleGrid = event;
  }

  

  sortingPromsArray(array: any) {
    let PromsArray = [
      ...array.filter(
        (prom: any) =>
          (prom.totalToEarn !== '0' && prom.isPayed === false) ||
          (prom.totalToEarn !== '0' && prom.disable === false)
      ),
      ...array.filter((prom: any) => prom.status === false),
      ...array.filter(
        (prom: any) =>
          prom.payedAmount !== '0' &&
          prom.totalToEarn === '0' &&
          prom.status !== 'rejected'
      ),
      ...array.filter((prom: any) => prom.status === 'rejected')
    ];

    return [...new Set(PromsArray)];
  }

  goToDetailsPage(id: string) {
    this.router.navigate(['/campaign/' + id], {
      queryParams: { type: 'earnings' }
    });
  }

  ngOnDestroy() {

    this.isDestroyed.next('');
    this.isDestroyed.complete();
    this.subscription?.unsubscribe();
    this.walletIdSubscription.unsubscribe();
    window.removeEventListener('scroll', this.onWindowScroll.bind(this), true);

    //this.ParticipationListService.clearDataFarming();
  }

  onScroll() {
   
    this.ParticipationListService.emitPageScroll();

  }

  toggleFilter() {
    this.showSort = false;
    this.showFilter = !this.showFilter;
  }

  toggleSort() {
    this.showFilter = false;
    this.showSort = !this.showSort;
    // //@ts-ignore
    // this.document.getElementById('center-content')?.style.overflow = 'hidden';
  }

  close(type: string) {
    if (type === 'filter') {
      this.showFilter = false;
    } else {
      this.showSort = false;
      if (this.showSort === false) {
        this.document.getElementById('center-content').style.overflow =
          'scroll';
      }
    }
  }
  sortViews(type: string) {
    if (type === 'up') {
      this.sortDownViews = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.views) - Number(a.views);
        }
      );
    } else if (type === 'down') {
      this.sortDownViews = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.views) - Number(b.views);
        }
      );
    }
  }
  sortLikes(type: string) {
    if (type === 'up') {
      this.sortDownLikes = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.likes) - Number(a.likes);
        }
      );
    } else if (type === 'down') {
      this.sortDownLikes = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.likes) - Number(b.likes);
        }
      );
    }
  }
  sortShares(type: string) {
    if (type === 'up') {
      this.sortDownShares = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.shares) - Number(a.shares);
        }
      );
    } else if (type === 'down') {
      this.sortDownShares = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.shares) - Number(b.shares);
        }
      );
    }
  }
  sortEarnings(type: string) {
    if (type === 'up') {
      this.sortDownEarnings = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.sum) - Number(a.sum);
        }
      );
    } else if (type === 'down') {
      this.sortDownEarnings = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.sum) - Number(b.sum);
        }
      );
    }
  }
  sortRestToClaim(type: string) {
    if (type === 'up') {
      this.sortDownRestToClaim = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.payedAmount) - Number(a.payedAmount);
        }
      );
    } else if (type === 'down') {
      this.sortDownRestToClaim = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.payedAmount) - Number(b.payedAmount);
        }
      );
    }
  }
  sortDate(type: string) {
    if (type === 'up') {
      this.sortDownDate = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return (
            (b.applyDate as Date).getTime() - (a.applyDate as Date).getTime()
          );
        }
      );
    } else if (type === 'down') {
      this.sortDownDate = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return (
            (a.applyDate as Date).getTime() - (b.applyDate as Date).getTime()
          );
        }
      );
    }
  }
  sortSendTitle(type: string) {
    if (type === 'up') {
      this.sortDownSendBy = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return b.campaign.title.localeCompare(a.campaign.title);
        }
      );
    } else if (type === 'down') {
      this.sortDownSendBy = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return a.campaign.title.localeCompare(b.campaign.title);
        }
      );
    }
  }
  sortMedia(type: string) {
    if (type === 'up') {
      this.sortDownMedia = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return b.oracle.localeCompare(a.oracle);
        }
      );
    } else if (type === 'down') {
      this.sortDownMedia = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return a.oracle.localeCompare(b.oracle);
        }
      );
    }
  }
  sortAbosNumber(type: string) {
    if (type === 'up') {
      this.sortDownAbosNumber = true;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.abosNumber) - Number(a.abosNumber);
        }
      );
    } else if (type === 'down') {
      this.sortDownAbosNumber = false;
      this.listLinks = this.listLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.abosNumber) - Number(b.abosNumber);
        }
      );
    }
  }

  scrollTo() {
    this.scroller.scrollToAnchor('testID');
  }
  newHandledLinks(links: any[]) {
    links.forEach((element: any) => {
      element.appliedDate = this.createDateFromUnixTimestamp(
        element.appliedDate
      );
      if (element.status !== true) element.totalToEarn = '0';
      if (
        element.totalToEarn &&
        compare(element.totalToEarn).gte(element.campaign.remaining)
      ) {
        element.totalToEarn = element.campaign.remaining;
      }
      if (element.totalToEarn && element.payedAmount) {
        if (new Big(element.totalToEarn).gte(new Big(element.payedAmount))) {
          element.totalToEarn = new Big(element.totalToEarn)
            .minus(new Big(element.payedAmount))
            .toFixed();
        }
        element.sum =
          element?.totalToEarn && element?.payedAmount
            ? new Big(element?.totalToEarn).plus(element?.payedAmount).toFixed()
            : element?.totalToEarn;
        if (element.isPayed === true && element?.payedAmount !== '0') {
          element.sum = element?.payedAmount;
        }
      } else if (element.totalToEarn && !element.payedAmount) {
        element.sum = element?.totalToEarn;
      }
      //................................................................................................
      element.safeURL = this.generatePostThumbnail(element);
      element.link = this.generatePostLink(element);

      //  if(!element.totalToEarn && element.status ==='true'){
      //   element.totalToEarn=0;
      //  }
      // element.campaign.description=this.sanitizer.bypassSecurityTrustHtml(element.campaign.description)
    });
    return links;
  }

  createDateFromUnixTimestamp(unixTimestamp: number) {
    if (unixTimestamp) {
      var a = new Date(unixTimestamp * 1000);
      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
      return time;
    } else {
      return;
    }
  }

  generatePostThumbnail(post: any): any {
    if (post.typeSN === '1') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.facebook.com/' + post.idUser + '/posts/' + post.idPost
      );
    } else if (post.typeSN === '3') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.instagram.com/p/' + post.idPost + '/'
      );
    } else if (post.typeSN === '4') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://twitter.com/' + post.idUser + '/status/' + post.idPost
      );
    } else {
      const idPost = post.idPost.split('&')[0];

      return this.sanitizer.bypassSecurityTrustResourceUrl(
        youtubeThumbnail + `${idPost}/0.jpg`
      );
    }
  }

  generatePostLink(post: any) {
    if (post.typeSN === 1) {
      return (
        'https://www.facebook.com/' + post.idUser + '/posts/' + post.idPost
      );
    } else if (post.typeSN === 3) {
      return 'https://www.instagram.com/p/' + post.idPost + '/';
    } else if (post.typeSN === 4) {
      return 'https://twitter.com/' + post.idUser + '/status/' + post.idPost;
    } else if (post.typeSN === 2) {
      return 'https://www.youtube.com/watch?v=' + post.idPost.split('&')[0];
    } else {
      return `https://www.linkedin.com/feed/update/urn:li:${post.typeURL}:${post.idPost}/`;
    }
  }
  trackByLinkId(index: number, link: Participation): string {
    return link.id;
  }
}
