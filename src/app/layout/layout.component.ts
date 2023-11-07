import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VoteService } from '../core/services/vote/vote.service';
import { ExternalWalletService } from '../core/services/vote/external-wallet.service';
import { NotificationService } from '../core/services/vote/notification.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('useDesktopModal', { static: false })
  public useDesktopModal!: TemplateRef<any>;
  scrollTopChange: boolean = false;
  smDevice = false;
  scrolled: boolean = false;
  phishingVisibility: boolean = false;
  getScreenWidth: any;
  private isDestroyed$ = new Subject();
  constructor(
    public router: Router,
    public voteService: VoteService,
    public notificationService: NotificationService,
    public externalWalletService: ExternalWalletService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}
  ngAfterViewInit(): void {
    if (this.router.url.includes('vote')) {
      let content = this.document.getElementById('center-content');
      content.classList.add('center-content-2');
    } else {
      let content = this.document.getElementById('center-content');
      content.classList.remove('center-content-2');
    }

    this.router.events
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          let outlet = this.document.getElementsByClassName('outlet');
          if (
            !this.router.url.includes('vote')
          ) {
            let content = this.document.getElementById('center-content');
            content.classList.remove('center-content-2');
          } else {
            let content = this.document.getElementById('center-content');
            content.classList.add('center-content-2');
          }
          if (outlet.length > 0) {
            outlet[0].scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    } else {
      this.smDevice = false;
    }
    
  }
  //change chart wallet position on the window re-size
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenWidth = event.target.innerWidth;
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 768) {
        this.smDevice = true;
      } else {
        this.smDevice = false;
      }
    
    }
  }
  close() {
    this.phishingVisibility = true;
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (
        event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight - 5
      ) {
        
        // if (this.router.url.startsWith('/vote') && this.smDevice) {
          // this.voteService.loadDataVotePageWhenEndScroll.next(true);
        // }
      }
      let cover = this.document.getElementById('campaign-cover');
      
        let header = this.document.getElementById('navbar-id');
        header.style.background =
          'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%);';
        header.classList.add('navbar-trans2');
        let content = this.document.getElementById('center-content');
        header.classList.remove('navbar-wallet');

        if (event.target.scrollTop === 0) {
          header.style.background = '';
          header.classList.remove('navbar-trans2');
          header.classList.remove('navbar-trans');
          header.classList.remove('navbar-wallet');
        }
      }
    }
  }

