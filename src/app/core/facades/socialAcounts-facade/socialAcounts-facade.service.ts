import { Injectable, Injector } from '@angular/core';

import { Store } from '@ngrx/store';
import { socialAccountState } from '../../store/social-accounts/reducers/social-accounts.reducer';
import { selectSocialAccount } from '../../store/social-accounts/selectors/social-accounts.selectors';
import { loadSocialAccountss, loadUpdatedSocialAccountss, loadSocialAccountssLogout } from '../../store/social-accounts/actions/social-accounts.actions';
import { ProfileService } from '../../services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class SocialAccountFacadeService {
  constructor(
    private injector: Injector,
    private store: Store<socialAccountState>,
    private profileService: ProfileService
  ) {}
  initSocialAccount() {
    this.dispatchSocialAccount();
  }
  public get socialAccount$() {
    //.pipe(filter((res) => res !== null));
    return this.store.select(selectSocialAccount);
  }
  dispatchSocialAccount() {
    this.store.dispatch(loadSocialAccountss());
  }
  dispatchUpdatedSocailAccount() {
    this.store.dispatch(loadUpdatedSocialAccountss());
  }
  dispatchLogoutSocialAccounts() {
    this.store.dispatch(loadSocialAccountssLogout());
  }
  /*-------------get-------- */
  getSocialNetworks() {
    return this.profileService.getSocialNetworks();
  }


  checkThreads() {
    return this.profileService.checkThreads();
  }

  addThreads() {
    return this.profileService.addThreads()
  }

  notification() {
    return this.profileService.notification();
  }
 
  
 
  
  /*-------delete-------- */
  deleteOneSocialNetworksGoogle(id: string) {
    return this.profileService.deleteOneSocialNetworksGoogle(id);
  }
  deleteOneSocialNetworksTwitter(id: string) {
    return this.profileService.deleteOneSocialNetworksTwitter(id);
  }
  deleteOneSocialNetworksFb(id: string) {
    return this.profileService.deleteOneSocialNetworksFb(id);
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
    return this.profileService.deleteOneSocialNetworksLinkedin(organization,linkedinId);
  }
  deleteTiktokChannel(tiktokProfileId: string) {
    return this.profileService.deleteTiktokChannel(tiktokProfileId);
  }
  deleteThreadAccount(id: string) {
    return this.profileService.deleteThreadAccount(id);
  }
  deleteAllTiktokChannels() {
    return this.profileService.deleteAllTiktokChannels();
  }
  deleteAllSocialNetworksGoogle() {
    return this.profileService.deleleteAllSocialNetworksGoogle();
  }
  deleteAllSocialNetworksFb() {
    return this.profileService.deleleteAllSocialNetworksFb();
  }
  deleteAllSocialNetworksLinkedin() {
    return this.profileService.deleteAllSocialNetworksLinkedin();
  }
  deleteAllSocialNetworksTwitter() {
    return this.profileService.deleleteAllSocialNetworksTwitter();
  }
}
