import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProfileSettingsFacadeService } from 'src/app/core/facades/profile-settings-facade.service';
import { TokenStorageService } from 'src/app/core/services/tokenStorage/token-storage-service.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-social-config',
  templateUrl: './social-config.component.html',
  styleUrls: ['./social-config.component.css']
})
export class SocialConfigComponent implements OnInit {
  percentNet: number = 0;
  percentNet2!: string;
  user!: User;
  private isDestroyed = new Subject();

  constructor(
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.calcPercent();
    this.tokenStorageService.setSecureWallet('visited-socialConfig', 'true');
  }
  calcPercent() {
    this.profileSettingsFacade
      .getSocialNetworks()
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        if (data) {
          let count2 = 0;
          if (
            data.facebook?.length !== 0 &&
            data.facebook?.instagram_username
          ) {
            count2++;
          }
          if (
            data.facebook?.length !== 0 &&
            !data.facebook?.instagram_username
          ) {
            count2++;
          }
          if (data.google?.length !== 0) {
            count2++;
          }
          if (data.twitter?.length !== 0) {
            count2++;
          }
          if (data.linkedin?.length !== 0) {
            count2++;
          }
          this.percentNet = (count2 * 100) / 5;
          this.percentNet2 = this.percentNet.toFixed(0) + '%';
        } else {
          this.percentNet2 = '0';
        }
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
