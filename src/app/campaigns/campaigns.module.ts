import { NgModule, ViewContainerRef, ViewRef } from '@angular/core';
import { CampaignsRoutingModule } from './campaigns-routing.module';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { FlatSelectComponent } from './components/filter-campaign/filter-campaign.component';
import { VerifyLinkComponent } from './components/verify-link/verify-link.component';
import { RecoverGainsComponent } from './components/recover-gains/recover-gains.component';
import { CampaignStatsComponent } from './components/campaign-stats/campaign-stats.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { ConfirmBlockchainActionComponent } from './components/confirm-blockchain-action/confirm-blockchain-action.component';
import { DraftCampaignPresentationComponent } from './components/draft-campaign-presentation/draft-campaign-presentation.component';
import { DraftCampaignParametresComponent } from './components/draft-campaign-parametres/draft-campaign-parametres.component';
import { RemunerationComponent } from './components/remuneration/remuneration.component';
import { DraftCampaignKitComponent } from './components/draft-campaign-kit/draft-campaign-kit.component';
import { CampaignsDashboardComponent } from './components/campaigns-dashboard/campaigns-dashboard.component';
import { FarmWelcomeComponent } from './components/farm-welcome/farm-welcome.component';
import { ParticiperComponent } from './components/participer/participer.component';
import { PasswordModalComponent } from './components/password-modal/password-modal.component';
import { TransactionMessageStatusComponent } from './components/transaction-message-status/transaction-message-status.component';
import { NgxTweetModule } from 'ngx-tweet';
import { DraftMaximumParticipationComponent } from './components/draft-maximum-participation/draft-maximum-participation.component';
import { CampaignsSharedUiModule } from './campaigns-shared-ui.module';
import { EffectsModule } from '@ngrx/effects';
import { LinksListEffects } from './store/effects/links-list.effects';
import { StoreModule } from '@ngrx/store';
import * as fromListLinks from './store/reducers/links-list.reducer';
import { NoPostsToFarmComponent } from './components/no-posts-to-farm/no-posts-to-farm.component';
import { MissionsComponent } from './components/missions/missions.component';
import { ConvertFromWei } from './../shared/pipes/wei-to-sa-tt.pipe';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DraftPictureComponent } from './components/draft-picture/draft-picture.component';
import { CommonModule } from '@angular/common';
import { SocialsComponent } from './socials/socials.component';
import { SharedModule } from './../shared/shared.module';

import { cryptoReducerList } from './../core/store/crypto-prices/reducer/crypto.reducer';
import { CryptoEffectsList } from './../core/store/crypto-prices/effects/crypto.effects';


import { CampaignDetailsModule } from './campaign-details/campaign-details.module';

@NgModule({
  declarations: [
    CampaignsDashboardComponent,
    DashboardHeaderComponent,
    FlatSelectComponent,
    VerifyLinkComponent,
    RecoverGainsComponent,
    CampaignStatsComponent,
    EditCampaignComponent,
    ConfirmBlockchainActionComponent,
    DraftCampaignPresentationComponent,
    DraftCampaignParametresComponent,
    RemunerationComponent,
    DraftCampaignKitComponent,
    FarmWelcomeComponent,
    NoPostsToFarmComponent,
    ParticiperComponent,
    PasswordModalComponent,
    TransactionMessageStatusComponent,
    MissionsComponent,
    DraftPictureComponent,
    SocialsComponent,
    DraftMaximumParticipationComponent
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    CampaignsSharedUiModule,
    CampaignDetailsModule,
    NgxTweetModule,
    EffectsModule.forFeature([LinksListEffects]),
    StoreModule.forFeature(
      fromListLinks.linksListFeatureKey,
      fromListLinks.reducer
    ),
    SharedModule,
    StoreModule.forFeature('cryptoPriceList', cryptoReducerList),
    EffectsModule.forFeature([CryptoEffectsList]),
  ],
  exports: [CampaignsRoutingModule],
  providers: [ConvertFromWei]
})
export class CampaignsModule {}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
