import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { CampaignsListItemPlaceholderUIComponent } from './components/campaigns-list-item-placeholder-ui/campaigns-list-item-placeholder-ui.component';
import { EditCoverBtnComponent } from './components/edit-cover-btn/edit-cover-btn.component';
import { StatDetailsCampaignComponent } from './components/stat-details-campaign/stat-details-campaign.component';
import { ToggleStyleHostComponent } from './components/toggle-style-host/toggle-style-host.component';
import { AdPoolFilterComponent } from './components/ad-pool-filter/ad-pool-filter.component';
import { AdPoolGridComponent } from './components/ad-pool-grid/ad-pool-grid.component';
import { DoubleToggleButtonComponent } from './components/double-toggle-button/double-toggle-button.component';
import { TogglePerformanceComponent } from './components/toggle-performance/toggle-performance.component';
import { MultiRangeSliderComponent } from './components/multi-range-slider/multi-range-slider.component';
import { NpnSliderModule } from 'npn-slider';
import { SelectSocialMediaComponent } from './components/select-social-media/select-social-media.component';
import { HeaderCampaignComponent } from './campaign-details/components/header-campaign/header-campaign.component';
import { CampaignsListItemComponent } from './components/campaigns-list-item/campaigns-list-item.component';

@NgModule({
  declarations: [
    CampaignsListItemPlaceholderUIComponent,
    EditCoverBtnComponent,
    StatDetailsCampaignComponent,
    ToggleStyleHostComponent,
    AdPoolFilterComponent,
    AdPoolGridComponent,
    DoubleToggleButtonComponent,
    TogglePerformanceComponent,
    MultiRangeSliderComponent,
    SelectSocialMediaComponent,
    HeaderCampaignComponent,
    CampaignsListItemComponent
  ],
  imports: [SharedModule, NpnSliderModule],
  exports: [
    SharedModule,
    CampaignsListItemPlaceholderUIComponent,
    EditCoverBtnComponent,
    StatDetailsCampaignComponent,
    ToggleStyleHostComponent,
    AdPoolFilterComponent,
    AdPoolGridComponent,
    DoubleToggleButtonComponent,
    TogglePerformanceComponent,
    MultiRangeSliderComponent,
    SelectSocialMediaComponent,
    HeaderCampaignComponent,
    CampaignsListItemComponent
  ]
})
export class CampaignsSharedUiModule {}
